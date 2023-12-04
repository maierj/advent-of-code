import {getNumberRange, readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines = readLinesFromParam()

const wins = lines.map((line) => {
	const comp = line.split(":")[1].split("|")
	const winning = comp[0].split(" ").map(v => v.trim()).filter(v => v !== "").map(v => parseInt(v));
	const own = comp[1].split(" ").map(v => v.trim()).filter(v => v !== "").map(v => parseInt(v));

	return {
		winning,
		own
	}
}).map(v => {
	return {
		...v,
		winCount: v.winning.reduce((acc, curr) => {
			if (v.own.includes(curr)) {
				return acc + 1;
			} else {
				return acc;
			}
		}, 0)
	}
})

const sumOfWins = wins
	.map((numbers) => {
		if (numbers.winCount === 0) {
			return 0
		} else {
			return 2 ** (numbers.winCount - 1);
		}
	}).reduce((acc, curr) => {
		return acc + curr;
	}, 0);

const getNumberOfCards = (win: { winning: number[], own: number[], winCount: number }, idx: number): number => {
	return 1 +
		getNumberRange(win.winCount)
			.map(v => {
				return getNumberOfCards(wins[idx + v + 1], idx + v + 1)
			})
			.reduce((acc, curr) => acc + curr, 0);
}

const result2 = wins.map((win, idx) => {
	return getNumberOfCards(win, idx);
}).reduce((acc, curr) => acc + curr, 0);

writeResultToFile({
	sumOfWins,
	result2
})