import {getNumberRange, readLinesFromParam, writeResultToFile} from "../../utils/utils";


const lines: string[][] = readLinesFromParam().map(line => line.split(""))
const linesTransposed: string[][] = [];

lines.forEach((line) => {
	line.forEach((char, columnIdx) => {
		if (linesTransposed.length > columnIdx) {
			linesTransposed[columnIdx].push(char)
		} else {
			linesTransposed[columnIdx] = [char]
		}
	})
})

const emptyRows = lines.map((line, idx) => line.includes("#") ? -1 : idx).filter(idx => idx >= 0);
const emptyColumns = linesTransposed.map((line, idx) => line.includes("#") ? -1 : idx).filter(idx => idx >= 0);

const expandedLines = lines.map((line, rowIdx) => {
	const expandedLine = line.map((char, columnIdx) => {
		if (emptyColumns.includes(columnIdx)) {
			return [char, char]
		} else {
			return [char]
		}
	}).flat()

	if (emptyRows.includes(rowIdx)) {
		return [expandedLine, expandedLine]
	} else {
		return [expandedLine]
	}
}).flat()

type Location = { rowIdx: number, columnIdx: number };
const galaxyLocations: Location[] = [];
expandedLines.forEach((line, rowIdx) => {
	line.forEach((char, columnIdx) => {
		if (char === "#") {
			galaxyLocations.push({rowIdx, columnIdx})
		}
	})
})

const galaxyDistances: number[] = [];

galaxyLocations.forEach((lhs, lhsIdx) => {
	galaxyLocations.forEach((rhs, rhsIdx) => {
		if (lhsIdx < rhsIdx) {
			galaxyDistances.push(Math.abs(lhs.rowIdx - rhs.rowIdx) + Math.abs(lhs.columnIdx - rhs.columnIdx))
		}
	})
})

const galaxyDistanceSum = galaxyDistances.reduce((acc, curr) => {
	return acc + curr
}, 0)

const expansionFactor = 1000000

const galaxyLocations2: Location[] = [];
lines.forEach((line, rowIdx) => {
	line.forEach((char, columnIdx) => {
		if (char === "#") {
			const emptyRowsBefore = emptyRows.filter(row => row < rowIdx).length;
			const emptyColumnsBefore = emptyColumns.filter(column => column < columnIdx).length;
			galaxyLocations2.push({
				rowIdx: rowIdx + emptyRowsBefore * (expansionFactor - 1),
				columnIdx: columnIdx + emptyColumnsBefore * (expansionFactor - 1)
			})
		}
	})
})

console.log(galaxyLocations2)

const galaxyDistances2: number[] = [];
galaxyLocations2.forEach((lhs, lhsIdx) => {
	galaxyLocations2.forEach((rhs, rhsIdx) => {
		if (lhsIdx < rhsIdx) {
			galaxyDistances2.push(Math.abs(lhs.rowIdx - rhs.rowIdx) + Math.abs(lhs.columnIdx - rhs.columnIdx))
		}
	})
})

const galaxyDistanceSum2 = galaxyDistances2.reduce((acc, curr) => {
	return acc + curr
}, 0)


writeResultToFile({
	galaxyDistanceSum,
	galaxyDistanceSum2
})