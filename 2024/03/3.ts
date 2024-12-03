import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const line = readLinesFromParam()[0]

const result1 = [...line.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g)].map((match) => {
	return parseInt(match[1]) * parseInt(match[2])
}).reduce((acc, curr) => {
	return acc + curr
}, 0);

console.log(line);

const doIndexes = [...line.matchAll(/do\(\)/g)].map((match) => {
	console.log(match)
	return match["index"]!
})

const dontIndexes = [...line.matchAll(/don't\(\)/g)].map((match) => {
	console.log(match)
	return match["index"]!
})

const result2 = [...line.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g)].map((match) => {
	const index = match["index"]!
	const closestDo = Math.min(...doIndexes.filter(el => el < index).map(el => index - el))
	const closestDont = Math.min(...dontIndexes.filter(el => el < index).map(el => index - el))

	if (closestDo < closestDont || (closestDo == Infinity && closestDont == Infinity)) {
		return parseInt(match[1]) * parseInt(match[2])
	} else {
		return 0
	}
}).reduce((acc, curr) => {
	return acc + curr
}, 0);

writeResultToFile({1: result1, 2: result2});