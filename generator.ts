import * as fs from "fs";
import path from "path";

const year = process.argv[2];
const day = process.argv[3];

console.log(process.argv);

if (!fs.existsSync(path.join(__dirname, year))) {
	fs.mkdirSync(path.join(__dirname, year));
}

if (!fs.existsSync(path.join(__dirname, year, day))) {
	fs.mkdirSync(path.join(__dirname, year, day));
}

if (!fs.existsSync(path.join(__dirname, year, day, `${day}.ts`))) {
	fs.writeFileSync(path.join(__dirname, year, day, `${day}.ts`), "");
}

if (!fs.existsSync(path.join(__dirname, year, day, `example_input.txt`))) {
	fs.writeFileSync(path.join(__dirname, year, day, `example_input.txt`), "");
}

if (!fs.existsSync(path.join(__dirname, year, day, `puzzle_input.txt`))) {
	fs.writeFileSync(path.join(__dirname, year, day, `puzzle_input.txt`), "");
}

console.log(`Run using npx ts-node ${year}/${day}/${day}.ts ${year}/${day}/example_input.txt`);