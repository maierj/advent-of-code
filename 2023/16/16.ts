import {Coordinate2D, Coordinate3D, getNumberRange, readLinesFromParam, writeResultToFile} from "../../utils/utils";
import {write} from "fs";
import {filter, uniq} from "lodash";
import {start} from "repl";

const map = readLinesFromParam().map(line => line.split(""));

type Direction = "up" | "down" | "left" | "right"

type State = {
	position: Coordinate2D
	direction: Direction
}

const equals = (lhs: State, rhs: State) => {
	return lhs.position.x === rhs.position.x && lhs.position.y === rhs.position.y && lhs.direction === rhs.direction
}
const simulateLightPath = (state: State, map: string[][], stateAcc: State[] = []): State[] => {
	const {position, direction} = state;

	if (position.x < 0 || position.y < 0 || position.x >= map[0].length || position.y >= map.length) {
		return [];
	}

	let nextPositions: State[] = [];

	switch (map[position.y][position.x]) {
		case "-":
			switch (direction) {
				case "down":
				case "up":
					nextPositions = [
						{
							position: {
								x: position.x - 1,
								y: position.y
							},
							direction: "left"
						},
						{
							position: {
								x: position.x + 1,
								y: position.y
							},
							direction: "right"
						}
					]
					break;
				case "left":
					nextPositions = [
						{
							position: {
								x: position.x - 1,
								y: position.y
							},
							direction: "left"
						}
					]
					break;
				case "right":
					nextPositions = [
						{
							position: {
								x: position.x + 1,
								y: position.y
							},
							direction: "right"
						}
					]
					break;
			}
			break;
		case "|":
			switch (direction) {
				case "right":
				case "left":
					nextPositions = [
						{
							position: {
								x: position.x,
								y: position.y - 1
							},
							direction: "up"
						},
						{
							position: {
								x: position.x,
								y: position.y + 1
							},
							direction: "down"
						}
					]
					break;
				case "up":
					nextPositions = [
						{
							position: {
								x: position.x,
								y: position.y - 1
							},
							direction: "up"
						}
					]
					break;
				case "down":
					nextPositions = [
						{
							position: {
								x: position.x,
								y: position.y + 1
							},
							direction: "down"
						}
					]
					break;
			}
			break;
		case "/":
			switch (direction) {
				case "right":
					nextPositions = [
						{
							position: {
								x: position.x,
								y: position.y - 1
							},
							direction: "up"
						}]
					break;
				case "left":
					nextPositions = [{
						position: {
							x: position.x,
							y: position.y + 1
						},
						direction: "down"
					}]
					break;
				case "up":
					nextPositions = [
						{
							position: {
								x: position.x + 1,
								y: position.y
							},
							direction: "right"
						}
					]
					break;
				case "down":
					nextPositions = [
						{
							position: {
								x: position.x - 1,
								y: position.y
							},
							direction: "left"
						}
					]
					break;
			}
			break;
		case "\\":
			switch (direction) {
				case "right":
					nextPositions = [
						{
							position: {
								x: position.x,
								y: position.y + 1
							},
							direction: "down"
						}]
					break;
				case "left":
					nextPositions = [{
						position: {
							x: position.x,
							y: position.y - 1
						},
						direction: "up"
					}]
					break;
				case "up":
					nextPositions = [
						{
							position: {
								x: position.x - 1,
								y: position.y
							},
							direction: "left"
						}
					]
					break;
				case "down":
					nextPositions = [
						{
							position: {
								x: position.x + 1,
								y: position.y
							},
							direction: "right"
						}
					]
					break;
			}
			break;
		default:
			switch (direction) {
				case "down":
					nextPositions = [
						{
							position: {
								x: position.x,
								y: position.y + 1
							},
							direction: "down"
						}
					]
					break;
				case "up":
					nextPositions = [
						{
							position: {
								x: position.x,
								y: position.y - 1
							},
							direction: "up"
						}
					]
					break;
				case "left":
					nextPositions = [
						{
							position: {
								x: position.x - 1,
								y: position.y
							},
							direction: "left"
						}
					]
					break;
				case "right":
					nextPositions = [
						{
							position: {
								x: position.x + 1,
								y: position.y
							},
							direction: "right"
						}
					]
					break;
			}
	}

	const filteredNextSteps = nextPositions.filter(pos => {
		return stateAcc.findIndex(accState => equals(accState, pos)) === -1;
	})

	stateAcc.push(...filteredNextSteps);

	return [
		state,
		...filteredNextSteps.map(pos => {
			return simulateLightPath(pos, map, stateAcc)
		}).flat()
	]
}

const energizedPositions = simulateLightPath({position: {x: 0, y: 0}, direction: "right"}, map).map(v => v.position);

const equals2D = (lhs: Coordinate2D, rhs: Coordinate2D) => {
	return lhs.x === rhs.x && lhs.y === rhs.y
}

const uniqueCoordinates = (input: Coordinate2D[]): Coordinate2D[] => {
	return input.reduce((acc, curr) => {
		const existingEnergizedPosition = acc.find((accPos) => equals2D(accPos, curr))
		if (existingEnergizedPosition) {
			return acc;
		} else {
			return [
				...acc,
				curr
			]
		}
	}, [] as Coordinate2D[])
}

const uniquePositions = uniqueCoordinates(energizedPositions);

const mapWidth = map[0].length
const mapHeight = map.length;

const startPositions: State[] = []

for (const xOffset of getNumberRange(mapWidth)) {
	startPositions.push({
		position: {
			x: xOffset,
			y: 0
		},
		direction: "down"
	})
	startPositions.push({
		position: {
			x: xOffset,
			y: mapHeight - 1
		},
		direction: "up"
	})
}

for (const yOffset of getNumberRange(mapWidth)) {
	startPositions.push({
		position: {
			x: 0,
			y: yOffset
		},
		direction: "right"
	})
	startPositions.push({
		position: {
			x: mapWidth - 1,
			y: yOffset
		},
		direction: "left"
	})
}

writeResultToFile({
	res1: uniquePositions.length,
	res2: startPositions.reduce((acc, curr, currIdx) => {
		console.log(currIdx / startPositions.length);
		const energizedPositions = uniqueCoordinates(simulateLightPath(curr, map).map(v => v.position)).length
		if (energizedPositions > acc) {
			return energizedPositions
		} else {
			return acc
		}
	}, 0)
})