import {Coordinate3D, getNumberRange, Line2D, readLinesFromParam, writeResultToFile} from "../../utils/utils";

type Brick = {
	id: number
	start: Coordinate3D
	end: Coordinate3D
}

function intersects(lhs: Line2D, rhs: Line2D) {
	const lhsXDiff = Math.abs(lhs.start.x - lhs.end.x) + 1;
	const lhsYDiff = Math.abs(lhs.start.y - lhs.end.y) + 1;
	const rhsXDiff = Math.abs(rhs.start.x - rhs.end.x) + 1;
	const rhsYDiff = Math.abs(rhs.start.y - rhs.end.y) + 1;

	for (const lhsXOffset of getNumberRange(lhsXDiff)) {
		for (const lhsYOffset of getNumberRange(lhsYDiff)) {
			for (const rhsXOffset of getNumberRange(rhsXDiff)) {
				for (const rhsYOffset of getNumberRange(rhsYDiff)) {
					const lhsX = lhs.start.x + lhsXOffset
					const lhsY = lhs.start.y + lhsYOffset
					const rhsX = rhs.start.x + rhsXOffset
					const rhsY = rhs.start.y + rhsYOffset

					if (lhsX === rhsX && lhsY === rhsY) {
						return true;
					}
				}
			}
		}
	}

	return false;
}

const bricks: Brick[] = readLinesFromParam()
	.map((line, lineIdx) => {
		const [start, end] = line.split("~");

		const startComponents = start.split(",").map(v => parseInt(v));
		const endComponents = end.split(",").map(v => parseInt(v));

		return {
			id: lineIdx,
			start: {
				x: startComponents[0],
				y: startComponents[1],
				z: startComponents[2],
			},
			end: {
				x: endComponents[0],
				y: endComponents[1],
				z: endComponents[2],
			}
		}
	}).sort((lhs, rhs) => {
		return Math.min(lhs.start.z, lhs.end.z) - Math.min(rhs.start.z, rhs.end.z)
	});

const settledBricks = bricks.reduce((acc, curr) => {
	let settled = false
	let settledHeight = curr.start.z;
	while (!settled) {
		if (settledHeight === 1) {
			settled = true
		} else {
			const collidingBrick = acc.find((settledBrick) => {
				return settledBrick.end.z + 1 === settledHeight && intersects({
					start: settledBrick.start,
					end: settledBrick.end
				}, {
					start: curr.start,
					end: curr.end
				})
			})

			if (collidingBrick) {
				settled = true
			} else {
				settledHeight--;
			}
		}
	}

	return [
		...acc,
		{
			id: curr.id,
			start: {
				...curr.start,
				z: settledHeight
			},
			end: {
				...curr.end,
				z: curr.end.z - (curr.start.z - settledHeight)
			}
		}
	] as Brick[]
}, [] as Brick[])

const getSupportingBricks = (brick: Brick, layout: Brick[]) => {
	return layout.filter((layoutBrick) => {
		return layoutBrick.end.z + 1 === brick.start.z && intersects(brick, layoutBrick)
	})
}

const getSupportedBricks = (brick: Brick, layout: Brick[]) => {
	return layout.filter((layoutBrick) => {
		return layoutBrick.start.z - 1 === brick.end.z && intersects(brick, layoutBrick)
	})
}

const numberOfDisintegratableBricks = settledBricks.filter((brick) => {
	const supportedBricks = getSupportedBricks(brick, settledBricks);
	for (const supportedBrick of supportedBricks) {
		if (getSupportingBricks(supportedBrick, settledBricks).length === 1) {
			return false
		}
	}

	return true
}).length;

const getFallingBricks = (brick: Brick, layout: Brick[]): Brick[] => {
	const supportedBricks = getSupportedBricks(brick, layout).filter((supportedBrick) => {
		return getSupportingBricks(supportedBrick, layout.filter(v => v.id !== brick.id)).length === 0
	});

	return supportedBricks
		.concat(supportedBricks.reduce((acc, curr) => {
			return acc.concat(getFallingBricks(curr, layout.filter(layoutBrick => !supportedBricks.concat(acc).map(v => v.id).includes(layoutBrick.id))));
		}, [] as Brick[]));
}

const res2 = settledBricks.reduce((acc, curr) => {
	return acc + [...(new Set(getFallingBricks(curr, settledBricks)))].length;
}, 0)

writeResultToFile({
	res1: numberOfDisintegratableBricks,
	res2
})