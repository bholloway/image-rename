var fs        = require('fs'),
    path      = require('path'),
    titleCase = require('title-case');

var exif = require('./exif');

function listImages(fileName) {

  // path exists
  var fullPath = path.resolve(fileName);
  if (fs.existsSync(fullPath)) {

    // recurse directories
    if (fs.statSync(fullPath).isDirectory()) {
      return fs.readdirSync(fullPath)
        .map((entry) => path.join(fullPath, entry))
        .map(listImages)
        .reduce((array, items) => array.concat(items), []);
    }
    // single file
    else {
      var metadata = exif(fullPath),
          datenum  = +metadata.exif.DateTimeOriginal / 1000,
          make     = metadata.image.Make.trim().split(/\s/).shift(),
          camera   = titleCase(make) + ' ' + metadata.image.Model.replace(make, '').trim();
      return {
        name     : path.basename(fullPath),
        timestamp: datenum,
        camera   : camera,
        location : path.dirname(fullPath)
      }
    }
  }
}

module.exports = listImages;