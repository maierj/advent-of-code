import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines = readLinesFromParam();

type SymbolLocation = {
	lineIdx: number
	columnIdx: number
}

type NumberLocation = SymbolLocation & {
	number: string
}

const symbolLocations = lines
	.map(v => v.split(""))
	.map((lineChars, lineIdx) => {
		return lineChars.reduce((acc, curr, columnIdx) => {
			if (!"0123456789.".includes(curr)) {
				return [
					...acc,
					{
						lineIdx,
						columnIdx
					}
				]
			} else {
				return acc;
			}
		}, [] as SymbolLocation[]);
	}).flat();

const numbers = lines
	.map(v => v.split(""))
	.map((lineChars, lineIdx) => {
		return lineChars.reduce((acc, curr, columnIdx) => {
			if ("0123456789".includes(curr) && (columnIdx === 0 || !"0123456789".includes(lineChars[columnIdx - 1]))) {
				var numberAcc = curr;
				var endOfNumberReached = false;
				var numberColumnIdx = columnIdx + 1;
				while (!endOfNumberReached && numberColumnIdx < lineChars.length) {
					if ("0123456789".includes(lineChars[numberColumnIdx])) {
						numberAcc += lineChars[numberColumnIdx];
					} else {
						endOfNumberReached = true;
					}

					numberColumnIdx++;
				}

				return [
					...acc,
					{
						lineIdx,
						columnIdx,
						number: numberAcc
					}
				]
			} else {
				return acc;
			}
		}, [] as NumberLocation[]);
	}).flat();

const result1 = numbers.filter((currNumber) => {
	const adjacentSymbols = symbolLocations.filter((currSymbol) => {
		return [
			currNumber.lineIdx - 1,
			currNumber.lineIdx,
			currNumber.lineIdx + 1
		].includes(currSymbol.lineIdx) && currSymbol.columnIdx >= currNumber.columnIdx - 1 && currSymbol.columnIdx <= currNumber.columnIdx + currNumber.number.length;
	});

	if (adjacentSymbols.length === 0) {
		console.log(currNumber);
	}

	return adjacentSymbols.length > 0;
}).reduce((acc, curr) => {
	return acc + parseInt(curr.number);
}, 0);

const result2 = symbolLocations.map((currSymbol) => {
	const adjacentNumbers = numbers.filter((currNumber) => {
		return [
			currNumber.lineIdx - 1,
			currNumber.lineIdx,
			currNumber.lineIdx + 1
		].includes(currSymbol.lineIdx) && currSymbol.columnIdx >= currNumber.columnIdx - 1 && currSymbol.columnIdx <= currNumber.columnIdx + currNumber.number.length;
	});

	return adjacentNumbers.length === 2 ? parseInt(adjacentNumbers[0].number) * parseInt(adjacentNumbers[1].number) : 0;
}).reduce((acc, curr) => {
	return acc + curr;
}, 0);

writeResultToFile({
	result1,
	result2
})


