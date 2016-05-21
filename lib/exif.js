var fs         = require('fs'),
    path       = require('path'),
    exifReader = require('exif-reader');

function exif(fileName) {
  var buffer = !!fileName && fs.readFileSync(path.resolve(fileName)),
      pending;

  // prepare data for exif reader
  if (buffer) {
    var header = buffer.toString('hex', 0, 2),
        isTiff = (header === '4949');

    // replace header with exif format and standard tiff header
    if (isTiff) {
      pending = new Buffer(buffer.length);
      (new Buffer('Exif\0')).copy(pending, 0, 0);
      (new Buffer([0x49, 0x49, 0x2a, 0x00])).copy(pending, 6, 0);
      buffer.copy(pending, 10, 4);
    }
    // find the exif section
    else {
      for (var offset = 1, isFound = false; (offset < buffer.length) && !isFound; offset++) {
        isFound = (buffer[offset - 1] === 0xFF) && (buffer[offset] === 0xE1);
      }
      if (isFound) {
        var exifLength = buffer.readUInt16BE(offset),
            exifStart  = offset + 2;
        pending = new Buffer(exifLength);
        buffer.copy(pending, 0, exifStart, exifStart + exifLength)
      }
    }
  }

  return pending ? exifReader(pending) : null;
}

module.exports = exif;