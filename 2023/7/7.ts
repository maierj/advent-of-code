import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines = readLinesFromParam();

const cards = [
	..."23456789TJQKA".split("")
];

const cards2 = [
	..."J23456789TQKA".split("")
];

const getType = (hand: string, jokerStyle: boolean = false) => {
	const cardCount = hand.split("").reduce((acc, curr) => {
		if (acc[curr]) {
			return {
				...acc,
				[curr]: acc[curr] + 1
			}
		} else {
			return {
				...acc,
				[curr]: 1
			}
		}
	}, {} as { [key: string]: number })

	if (jokerStyle) {
		const jokerCount = cardCount["J"] ?? 0;
		delete cardCount["J"]
		const maxCount = Object.values(cardCount).max(v => v) as number;

		if (maxCount === 5) {
			return 6;
		} else if (maxCount === 4) {
			return 5 + jokerCount;
		} else if (maxCount === 3) {
			if (jokerCount > 0) {
				return maxCount + jokerCount + 1
			} else {
				return Object.values(cardCount).includes(2) ? 4 : 3;
			}
		} else if (maxCount === 2) {
			if (jokerCount > 0) {
				if (Object.values(cardCount).filter(v => v === 2).length === 2) {
					return 4;
				} else {
					switch (jokerCount) {
						case 1:
							return 3;
						case 2:
							return 5;
						case 3:
							return 6;
						default:
							throw Error()
					}
				}
			} else {
				if (Object.values(cardCount).filter(v => v === 2).length === 2) {
					return 2;
				} else {
					return 1
				}
			}
		} else {
			if (jokerCount > 0) {
				switch (jokerCount) {
					case 5:
						return 6;
					case 4:
						return 6;
					case 3:
						return 5;
					case 2:
						return 3;
					case 1:
						return 1;
					default:
						console.log({
							hand,
							cardCount,
							jokerCount
						})
						throw Error();
				}
			} else {
				return 0;
			}
		}
	} else {
		const maxCount = Object.values(cardCount).max(v => v) as number;
		if (maxCount === 5) {
			return 6;
		} else if (maxCount === 4) {
			return 5;
		} else if (maxCount === 3) {
			return Object.values(cardCount).includes(2) ? 4 : 3;
		} else if (maxCount === 2) {
			if (Object.values(cardCount).filter(v => v === 2).length === 2) {
				return 2;
			} else {
				return 1
			}
		} else {
			return 0;
		}
	}
}

const compareHands = (lhs: string, rhs: string, jokerStyle: boolean = false) => {
	if (getType(lhs, jokerStyle) > getType(rhs, jokerStyle)) {
		return 1;
	} else if (getType(lhs, jokerStyle) < getType(rhs, jokerStyle)) {
		return -1;
	} else {
		let res: string | null = null;

		lhs.split("").forEach((l, idx) => {
			if (res === null) {
				const lIdx = (jokerStyle ? cards2 : cards).indexOf(l);
				const rIdx = (jokerStyle ? cards2 : cards).indexOf(rhs.split("")[idx]);

				if (lIdx > rIdx) {
					res = lhs;
				} else if (rIdx > lIdx) {
					res = rhs;
				}
			}
		})

		if (res === lhs) {
			return 1
		} else if (res === rhs) {
			return -1;
		} else {
			return 0
		}
	}
}

type Player = {
	hand: string
	bid: number
};

const players: Player[] = lines.map((line) => {
	const [hand, bid] = line.split(" ");
	return {
		hand,
		bid: parseInt(bid)
	}
});

players.sort((lhs, rhs) => {
	return compareHands(lhs.hand, rhs.hand);
})

const res1 = players.reduce((acc, curr, currIdx) => {
	return acc + (currIdx + 1) * curr.bid
}, 0);

players.sort((lhs, rhs) => {
	return compareHands(lhs.hand, rhs.hand, true);
})

const res2 = players.reduce((acc, curr, currIdx) => {
	return acc + (currIdx + 1) * curr.bid
}, 0);

writeResultToFile({
	res1,
	res2
})