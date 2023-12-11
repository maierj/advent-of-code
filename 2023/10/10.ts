import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines = readLinesFromParam().map(line => line.split(""));

const height = lines.length
const width = lines[0].length

type Pipe = "|" | "-" | "L" | "F" | "J" | "7"

type Coordinate = {
	x: number
	y: number
}

type Connection = [Coordinate, Coordinate, Coordinate];

let startLocation: Coordinate;

const connections: Connection[] = lines.map((line, y) => {
	return line
		.map((point, x): Connection | null => {
			if (point !== "." && point !== "S") {
				const pipe = point as Pipe;
				let start: Coordinate;
				let end: Coordinate
				switch (pipe) {
					case "|":
						start = {x, y: y - 1};
						end = {x, y: y + 1}
						if (start.x >= 0 && start.y >= 0 && end.x >= 0 && end.y >= 0 && start.x < width && end.x < width && start.y < height && end.y < height && "|7FS".includes(lines[start.y][start.x]) && "|JLS".includes(lines[end.y][end.x])) {
							return [start, {x, y}, end]
						} else {
							return null;
						}
					case "-":
						start = {x: x - 1, y};
						end = {x: x + 1, y}
						if (start.x >= 0 && start.y >= 0 && end.x >= 0 && end.y >= 0 && start.x < width && end.x < width && start.y < height && end.y < height && "F-LS".includes(lines[start.y][start.x]) && "-7JS".includes(lines[end.y][end.x])) {
							return [start, {x, y}, end]
						} else {
							return null;
						}
					case "7":
						start = {x: x - 1, y};
						end = {x, y: y + 1}
						if (start.x >= 0 && start.y >= 0 && end.x >= 0 && end.y >= 0 && start.x < width && end.x < width && start.y < height && end.y < height && "F-LS".includes(lines[start.y][start.x]) && "|JLS".includes(lines[end.y][end.x])) {
							return [start, {x, y}, end]
						} else {
							return null;
						}
					case "J":
						start = {x: x - 1, y};
						end = {x, y: y - 1}
						if (start.x >= 0 && start.y >= 0 && end.x >= 0 && end.y >= 0 && start.x < width && end.x < width && start.y < height && end.y < height && "F-LS".includes(lines[start.y][start.x]) && "|F7S".includes(lines[end.y][end.x])) {
							return [start, {x, y}, end]
						} else {
							return null;
						}
					case "F":
						start = {x: x + 1, y};
						end = {x, y: y + 1}
						if (start.x >= 0 && start.y >= 0 && end.x >= 0 && end.y >= 0 && start.x < width && end.x < width && start.y < height && end.y < height && "-J7S".includes(lines[start.y][start.x]) && "J|LS".includes(lines[end.y][end.x])) {
							return [start, {x, y}, end]
						} else {
							return null;
						}
					case "L":
						start = {x: x + 1, y};
						end = {x, y: y - 1}
						if (start.x >= 0 && start.y >= 0 && end.x >= 0 && end.y >= 0 && start.x < width && end.x < width && start.y < height && end.y < height && "J7-S".includes(lines[start.y][start.x]) && "|F7S".includes(lines[end.y][end.x])) {
							return [start, {x, y}, end]
						} else {
							return null;
						}
				}
			} else {
				if (point === "S") {
					startLocation = {x, y};
				}

				return null;
			}
		})
		.filter(v => v !== null)
		.filter(connection => {
			const [s, m, d] = connection!;
			return s.x >= 0 && s.y >= 0 && m.x >= 0 && m.y >= 0 && d.x >= 0 && d.y >= 0
		});
}).flat() as Connection[];

const coordEquals = (lhs: Coordinate, rhs: Coordinate) => lhs.x === rhs.x && lhs.y === rhs.y;

let path: Coordinate[] = [startLocation!];
let pathClosed = false;

while (!pathClosed) {
	const currCoordinate = path[path.length - 1]!;
	const connectionCandidates = connections
		.map(([connStart, connMiddle, connEnd]) => {
			if (coordEquals(connStart, currCoordinate) && !path.find(p => coordEquals(p, connMiddle))) {
				if (path.find(p => coordEquals(p, connEnd))) {
					return [connMiddle];
				} else {
					return [connMiddle, connEnd];
				}
			} else if (coordEquals(connEnd, currCoordinate) && !path.find(p => coordEquals(p, connMiddle))) {
				if (path.find(p => coordEquals(p, connStart))) {
					return [connMiddle];
				} else {
					return [connMiddle, connStart];
				}
			} else {
				return null
			}
		})
		.filter(v => v !== null);

	if (connectionCandidates.length > 0) {
		path.push(...connectionCandidates[0]!);
	} else {
		path.push(startLocation!);
		pathClosed = true;
	}
}

writeResultToFile({
	res1: (path.length - 1) / 2
})