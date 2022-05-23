let fs = require("fs");
let path = require("path");
let { stdout } = process;

let folderPath = "03-files-in-folder/secret-folder";

fs.readdir(path.join(folderPath), { withFileTypes: true }, (error, data) => {
  if (error) throw error;
  else {
    data.forEach((file) => {
      if (file.isFile()) {
        let fileName = file.name.split(".")[0];
        let fileExt = path.extname(file.name);
        
        fs.stat(path.join(folderPath, file.name), (error, stats) => {
          if (error) throw error;
          let size = 0;
          size += stats.size;
          stdout.write(`${fileName} - ${fileExt} - ${size}b\n`);
        });
      }
    });
  }
});
