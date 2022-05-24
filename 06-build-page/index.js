const fs = require('fs');
const path = require('path');
const dist = 'project-dist';

async function getFilesData(dir, type) {
    const files = await fs.promises.readdir(path.resolve(__dirname, dir)).then(files => files.filter(file => path.extname(file) === type));
    const data = await Promise.all(files.map(async file => ({file: path.parse(file).name, data: await fs.promises.readFile(path.resolve(__dirname, dir, file), "utf8")})));
    return data.reduce((obj, el) => {obj[el.file] = el.data; return obj} , {})
};


(async function start() {
    await fs.promises.rmdir(path.resolve(__dirname, dist), { recursive: true, force: true }).then(_ => fs.promises.mkdir(path.resolve(__dirname, dist)));
    await copyDir(path.resolve(__dirname, 'assets'), path.resolve(__dirname, dist, 'assets'));
    const [styles, components] = await Promise.all([getFilesData('styles', '.css'), getFilesData('components', '.html')]);
    await fs.promises.writeFile(path.resolve(__dirname, dist, 'style.css'), [...styles.header, ...styles.main, ...styles.footer].join(''));

    const template = await fs.promises.readFile(path.resolve(__dirname, 'template.html'), "utf8");
    const index = template.replace('{{header}}', components.header).replace('{{articles}}', components.articles).replace('{{footer}}', components.footer)
    await fs.promises.writeFile(path.resolve(__dirname, dist, 'index.html'), index);
}())


async function copyDir(pathFile, pathFileCopy) {
  await fs.promises.mkdir(pathFileCopy, { recursive: true, force: true });
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

