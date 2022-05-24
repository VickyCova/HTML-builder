const fs = require('fs');
const path = require('path');

(async function start() {
    const files = await fs.promises.readdir(path.resolve(__dirname, 'styles')).then(files => files.filter(file => path.extname(file) === '.css'));
    const contents = await Promise.all(files.map(async file => fs.promises.readFile(path.resolve(__dirname, 'styles', file), "utf8")));
    await fs.promises.writeFile(path.resolve(__dirname, 'project-dist', 'bundle.css'), contents.join('\n'));
    console.log('Запись завершена')
}())
