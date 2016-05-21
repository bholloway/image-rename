#!/usr/bin/env node

var fs   = require('fs'),
    path = require('path');

var listImages = require('../lib/list-images');

var index    = process.argv.length - 1,
    fileName = process.argv[index],
    command  = process.argv[index - 1],
    isRename = (command === 'rename');

if (isRename) {
  process.stdout.write('---------------------------\nIMPORTANT rename will occur\n---------------------------\n');
  setTimeout(begin, 5000);
}
else {
  begin();
}


function begin() {
  listImages(fileName)
    .forEach((result) => {
      var extension = path.extname(result.name).slice(1).toLowerCase(),
          newName   = [result.timestamp, result.camera, extension]
            .join('.')
            .replace(/\s+/g, '-');
      if (isRename) {
        fs.renameSync(path.join(result.location, result.name), path.join(result.location, newName));
      }
      process.stdout.write(newName + '\n');
    });
}