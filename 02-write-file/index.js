let fs = require("fs");
let path = require("path");
let content = "";
let output = fs.createWriteStream("02-write-file/file.txt");
let process = require("process");
let { stdin, stdout } = process;

fs.writeFile(path.join(__dirname, "file.txt"), content, (error) => {
  if (error) throw error;

  stdout.write("Привет! Меня зовут Виктория. Как твое имя?..");
  stdin.on("data", (data) => {
    if (data.toString().trim() === "exit") {
      process.on("exit", () =>
        console.log("Приятно было познакомиться! Удачи!")
      );
      process.exit();
    } else {
      output.write(data);
    }
  });

  fs.appendFile("02-write-file/file.txt", content, (err) => {
    if (err) throw err;
  });

  process.on("SIGINT", () => {
    console.log("Приятно было познакомиться! Удачи!");
    process.exit();
  });
});
