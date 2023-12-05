import * as fs from 'fs';

declare global {
	interface Array<T> {
		max(valueSelector: (element: T) => number): T | null;

		min(valueSelector: (element: T) => number): T | null;
	}
}

Array.prototype.max = function (valueSelector: (element: any) => number) {
	return this.reduce((acc, curr) => acc === null || valueSelector(curr) > valueSelector(acc) ? curr : acc, null);
}

Array.prototype.min = function (valueSelector: (element: any) => number) {
	return this.reduce((acc, curr) => acc === null || valueSelector(curr) < valueSelector(acc) ? curr : acc, null);
}

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

export function readLinesFromParam(lineSeparator?: string) {
	return readFileFromParam().split(lineSeparator ?? '\n');
}

export function writeResultToFile(result: any) {
	const outputFileName = getInputFileName().replace(/\.txt$/, '_solution.txt');
	console.log(`Writing result "${JSON.stringify(result)}" to file.`);
	fs.writeFileSync(outputFileName, JSON.stringify(result));
}