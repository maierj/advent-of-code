import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines: [string, number[]][] = readLinesFromParam().map(line => line.split(" ")).map(([lhs, rhs]) => [lhs, rhs.split(",").map(v => parseInt(v))]);

const matchesSpec = (constellation: string, spec: number[]): boolean => {
	if (spec.length === 0) {
		return constellation.length === 0 || /^\.*$/.test(constellation)
	}

	const regex = new RegExp(`(^|^\\.+)#{${spec[0]}}(\\.|$)`);
	const match = constellation.match(regex);

	if (match && match.length > 0) {
		return matchesSpec(constellation.slice(match[0].length), spec.slice(1))
	} else {
		return false;
	}
}

const constellations = lines.map(([lhs, rhs]) => {
	return lhs
		.split("")
		.reduce((acc, curr) => {
			if (curr === "?") {
				return acc.map(v => [[...v, "."], [...v, "#"]]).flat()
			} else {
				return acc.map(v => [...v, curr])
			}
		}, [[]] as string[][])
		.map(constellation => constellation.join(""))
		.filter(constellation => {
			return matchesSpec(constellation, rhs as number[])
		})
});

const res1 = constellations.reduce((acc, curr) => acc + curr.length, 0);

writeResultToFile({
	res1
})
