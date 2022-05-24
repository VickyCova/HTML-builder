let fs = require("fs");
let path = require('path');
let process = require('process');

let readingFile = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf8');
readingFile.on('data', data => process.stdout.write(data));
