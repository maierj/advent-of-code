import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines = readLinesFromParam();

const colors = {
	red: 12,
	green: 13,
	blue: 14
}

type Selection = {
	round: number,
	red: number,
	green: number,
	blue: number,
	possible: boolean
}

const games = lines.map((line) => {
	const gameComp = line.split(":").map(v => v.trim());

	const round = parseInt(gameComp[0].split(" ")[1])

	return gameComp[1]
		.split(";")
		.map(selection => selection.trim())
		.map(selection => {
			return selection
				.split(", ")
				.map(v => v.trim())
				.reduce((acc, curr) => {
					const comp = curr.split(" ");
					if (comp[1] === "blue") {
						return {
							...acc,
							blue: acc.blue + parseInt(comp[0])
						}
					} else if (comp[1] === "red") {
						return {
							...acc,
							red: acc.red + parseInt(comp[0])
						}
					} else {
						return {
							...acc,
							green: acc.green + parseInt(comp[0])
						}
					}
				}, {round: round, red: 0, green: 0, blue: 0} as Selection)
		})
		.map((selection) => {
			return {
				...selection,
				possible: selection.red <= colors.red && selection.green <= colors.green && selection.blue <= colors.blue
			};
		})
})

const possibleIdSum = games.reduce((acc, curr) => {
	return curr.find((sel) => !sel.possible) ? acc : acc + curr[0].round;
}, 0)

const power = games
	.map(game => {
		return game.reduce((acc, curr) => {
			return {
				red: curr.red > acc.red ? curr.red : acc.red,
				green: curr.green > acc.green ? curr.green : acc.green,
				blue: curr.blue > acc.blue ? curr.blue : acc.blue,
			}
		}, {red: 0, green: 0, blue: 0})
	})
	.map((min) => {
		return min.red * min.green * min.blue;
	})
	.reduce((acc, curr) => {
		return acc + curr
	}, 0)

writeResultToFile({
	possibleIdSum,
	power
})