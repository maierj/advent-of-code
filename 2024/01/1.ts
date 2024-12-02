import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const [list1, list2] = readLinesFromParam().map((line) => line.split("   ")).reduce(([acc1, acc2], [curr1, curr2]) => {
	return [
		[...acc1, parseInt(curr1)].sort(),
		[...acc2, parseInt(curr2)].sort(),
	]
}, [[], []] as number[][]);

const distance = list1.reduce((acc, curr, idx) => {
	return acc + Math.abs(curr - list2[idx])
}, 0);

const similarity = list1.reduce((acc, curr, idx) => {
	return acc + (curr * list2.filter((el2) => el2 === curr).length)
}, 0);

writeResultToFile({1: distance, 2: similarity});