import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const numbers: { [key: string]: number } = {
	"1": 1,
	"one": 1,
	"2": 2,
	"two": 2,
	"3": 3,
	"three": 3,
	"4": 4,
	"four": 4,
	"5": 5,
	"five": 5,
	"6": 6,
	"six": 6,
	"7": 7,
	"seven": 7,
	"8": 8,
	"eight": 8,
	"9": 9,
	"nine": 9
};

const lines = readLinesFromParam()

const sum = lines.map(line => {
	const numbers = line.split("").filter(char => char.match(/[0-9]/) != null);
	return parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`)
}).reduce((acc, curr) => acc + curr, 0);

const sum2 = lines.map((line) => {
	const numberIndexes = Object.keys(numbers).map(number => ({
		number,
		firstIndex: line.indexOf(number) === -1 ? null : line.indexOf(number),
		lastIndex: line.lastIndexOf(number) === -1 ? null : line.lastIndexOf(number)
	})).filter(numberObj => numberObj.firstIndex !== null);

	const lowestIndexNumber = numberIndexes.reduce((acc, curr) => {
		if (acc === null || curr.firstIndex! < acc.firstIndex!) {
			return curr
		} else {
			return acc;
		}
	}, null as { number: string, firstIndex: number | null, lastIndex: number | null } | null)?.number

	const highestIndexNumber = numberIndexes.reduce((acc, curr) => {
		if (acc === null || curr.lastIndex! > acc.lastIndex!) {
			return curr
		} else {
			return acc;
		}
	}, null as { number: string, firstIndex: number | null, lastIndex: number | null } | null)?.number

	return parseInt(`${numbers[lowestIndexNumber!] as number}${numbers[highestIndexNumber!] as number}`)
}).reduce((acc, curr) => acc + curr, 0);

writeResultToFile({
	sum,
	sum2
})