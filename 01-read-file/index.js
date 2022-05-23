let fs = require("fs");
const path = require('path');

fs.readFile(
  path.join(__dirname, 'text.txt'), "utf8", (error, content) => {
  if (error) throw error;
  console.log(content);
});
