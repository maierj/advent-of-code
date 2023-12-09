import {readLinesFromParam, writeResultToFile} from "../../utils/utils";
import {write} from "fs";

const lines = readLinesFromParam();

const trees = lines.map(line => {
	const input = line.split(" ").map(v => parseInt(v));

	const tree: number[][] = [input];

	while (tree[tree.length - 1].filter(v => v !== 0).length > 0) {
		const relevantGen = tree[tree.length - 1]
		const nextGen = relevantGen.reduce((acc, curr, currIdx) => {
			if (currIdx < relevantGen.length - 1) {
				return [...acc, relevantGen[currIdx + 1] - relevantGen[currIdx]]
			} else {
				return acc
			}
		}, [] as number[])

		tree.push(nextGen)
	}

	tree[tree.length - 1].push(0);

	console.log(tree);

	for (let genIdx = 0; genIdx < tree.length - 1; genIdx++) {
		const v = tree[tree.length - 2 - genIdx];
		const vBelow = tree[tree.length - 1 - genIdx];
		v.push(v[v.length - 1] + vBelow[vBelow.length - 1])
	}

	tree[tree.length - 1].unshift(0);

	console.log(tree);

	for (let genIdx = 0; genIdx < tree.length - 1; genIdx++) {
		const v = tree[tree.length - 2 - genIdx];
		const vBelow = tree[tree.length - 1 - genIdx];
		v.unshift(v[0] - vBelow[0])
	}

	console.log(tree);

	return tree;
});

const res1 = trees.reduce((acc, curr) => {
	const gen = curr[0];
	return acc + gen[gen.length - 1]
}, 0)


const res2 = trees.reduce((acc, curr) => {
	const gen = curr[0];
	return acc + gen[0]
}, 0)

writeResultToFile({
	res1,
	res2
})