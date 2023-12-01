import * as fs from 'fs';

function getInputFileName() {
  const inputParam = process.argv[process.argv.length - 1];
  return `${process.cwd()}${
    inputParam.startsWith('/') ? '' : '/'
  }${inputParam}`;
}

export function getNumberRange(n: number) {
  return [...Array(n).keys()];
}

export function readFileFromParam() {
  return fs.readFileSync(getInputFileName()).toString();
}

export function readLinesFromParam() {
  return readFileFromParam().split('\n');
}

export function writeResultToFile(result: any) {
  const outputFileName = getInputFileName().replace(/\.txt$/, '_solution.txt');
  console.log(`Writing result "${JSON.stringify(result)}" to file.`);
  fs.writeFileSync(outputFileName, JSON.stringify(result));
}
