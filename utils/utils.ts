import * as fs from 'fs';
import * as path from "path";
import _ from "lodash";

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

export function transpose<T>(array: T[][]) {
	const transposed: T[][] = [];
	array.forEach((row, rowIdx) => {
		if (transposed.length === 0) {
			row.forEach((col, colIdx) => {
				transposed.push([]);
			})
		}

		row.forEach((col, colIdx) => {
			transposed[colIdx].push(col);
		})
	})

	return transposed
}

export function writeToFile(fileName: string, value: any) {
	const pathName = path.join(process.cwd(), fileName);
	let fileContent;

	if (_.isArray(value)) {
		fileContent = (value as any[]).map(v => {
			return `${v}`
		}).join("\n")
	} else {
		fileContent = `${value}`
	}
	fs.writeFileSync(pathName, fileContent);
}

export function writeResultToFile(result: any) {
	const outputFileName = getInputFileName().replace(/\.txt$/, '_solution.txt');
	console.log(`Writing result "${JSON.stringify(result)}" to file.`);
	fs.writeFileSync(outputFileName, JSON.stringify(result));
}

export type Coordinate3D = Coordinate2D & {
	z: number
}

export type Coordinate2D = {
	x: number
	y: number
}

export const equals2D = (lhs: Coordinate2D, rhs: Coordinate2D) => {
	return lhs.x === rhs.x && lhs.y === rhs.y
}

export type Line2D = {
	start: Coordinate2D
	end: Coordinate2D
}