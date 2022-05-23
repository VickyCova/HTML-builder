let fs = require("fs");
let promise = require("fs/promises");
let path = require("path");
let pathFile = path.join(__dirname, "files");
let pathFileCopy = path.join(__dirname, "files-copy");

async function copyDir(pathFile, pathFileCopy) {
  await promise.mkdir(pathFileCopy, { recursive: true, force: true });
  fs.readdir(pathFileCopy, (error, data) => {
    if (error) throw error;
    for (let file of data) {
      fs.access(path.join(pathFile, file), (error) => {
        if (error) {
          fs.rm(path.join(pathFileCopy, file), (error) => {
            if (error) throw error;
          });
        }
      });
    }
  });
  fs.readdir(pathFile, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    for (let files of data) {
      if (files.isFile()) {
        fs.copyFile(
          path.join(pathFile, files.name),
          path.join(pathFileCopy, files.name),
          (error) => {
            if (error) throw error;
          }
        );
      } else if (files.isDirectory()) {
        copyDir(
          path.join(pathFile, files.name),
          path.join(pathFileCopy, files.name)
        );
      }
    }
  });
}

copyDir(pathFile, pathFileCopy);
