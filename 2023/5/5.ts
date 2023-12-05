import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines = readLinesFromParam("\n\n");

const seeds = lines[0].split(" ").filter(v => v !== "seeds:").map(v => parseInt(v.trim()));

const mapChain = lines.slice(1).map((line) => {
	const mapFunctions = line
		.split("\n")
		.slice(1)
		.map(v => {
			const [destStart, srcStart, range] = v
				.split(" ")
				.map(v => parseInt(v.trim()));

			return (value: number) => {
				if (value >= srcStart && value <= srcStart + range) {
					return destStart + (value - srcStart)
				} else {
					return null;
				}
			}
		})

	return (value: number) => {
		for (const func of mapFunctions) {
			const res = func(value);
			if (res !== null) {
				return res
			}
		}
	}
})

const nearestLocation = seeds.map(seed => {
	return mapChain.reduce((acc, curr) => {
		return curr(acc) ?? acc;
	}, seed);
}).min(v => v);


// PART TWO

type InputRange = {
	start: number
	length: number
}

type InputRangeWithPendingOffset = InputRange & {
	offset: number
}

type RangeModification = {
	inputRange: InputRange
	offset: number
}

const inputRanges = seeds.reduce((acc, curr, currIdx) => {
	if (currIdx % 2 === 0) {
		return [
			...acc,
			{
				start: curr
			}
		];
	} else {
		return [
			...acc.slice(0, -1),
			{
				...acc[acc.length - 1],
				length: curr
			}
		]
	}
}, [] as any[]) as InputRange[];

const modificationGenerations = lines.slice(1)
	.map((line) => {
		return line
			.split("\n")
			.slice(1)
			.map(v => {
				const [destStart, srcStart, range] = v
					.split(" ")
					.map(v => parseInt(v.trim()));

				return {
					inputRange: {
						start: srcStart,
						length: range
					},
					offset: destStart - srcStart
				}
			}) as RangeModification[];
	});

const hasOverlap = (lhs: InputRange, rhs: InputRange) => {
	return !(lhs.start > rhs.start + rhs.length || lhs.start + lhs.length < rhs.start)
}

const getOverlap = (lhs: InputRange, rhs: InputRange): InputRange | null => {
	if (lhs.start >= rhs.start && lhs.start <= rhs.start + rhs.length) {
		if (lhs.start + lhs.length > rhs.start + rhs.length) {
			return {
				start: lhs.start,
				length: rhs.start + rhs.length - lhs.start
			}
		} else {
			return {
				start: lhs.start,
				length: lhs.length
			}
		}
	} else if (lhs.start + lhs.length <= rhs.start + rhs.length && lhs.start + lhs.length >= rhs.start) {
		if (lhs.start < rhs.start) {
			return {
				start: rhs.start,
				length: lhs.start + lhs.length - rhs.start
			}
		} else {
			return {
				start: lhs.start,
				length: lhs.length
			}
		}
	} else if (lhs.start <= rhs.start && lhs.start + lhs.length > rhs.start + rhs.length) {
		return {
			start: rhs.start,
			length: rhs.length
		}
	} else {
		return null
	}
}

const applyMod = (input: InputRangeWithPendingOffset, mod: RangeModification): InputRangeWithPendingOffset[] => {
	const lhs = input;
	const rhs = mod.inputRange;

	if (lhs.start >= rhs.start && lhs.start <= rhs.start + rhs.length) {
		if (lhs.start + lhs.length > rhs.start + rhs.length) {
			return [
				{
					start: lhs.start,
					length: rhs.start + rhs.length - lhs.start,
					offset: mod.offset
				},
				{
					start: rhs.start + rhs.length,
					length: lhs.start + lhs.length - (rhs.start + rhs.length),
					offset: input.offset
				}
			]
		} else {
			return [
				{
					start: lhs.start,
					length: lhs.length,
					offset: mod.offset
				}
			]
		}
	} else if (lhs.start + lhs.length <= rhs.start + rhs.length && lhs.start + lhs.length >= rhs.start) {
		if (lhs.start < rhs.start) {
			return [
				{
					start: lhs.start,
					length: rhs.start - lhs.start,
					offset: input.offset
				},
				{
					start: rhs.start,
					length: lhs.length - (rhs.start - lhs.start),
					offset: mod.offset
				}
			]
		} else {
			return [{
				start: lhs.start,
				length: lhs.length,
				offset: mod.offset
			}]
		}
	} else if (lhs.start <= rhs.start && lhs.start + lhs.length > rhs.start + rhs.length) {
		return [
			{
				start: lhs.start,
				length: rhs.start - lhs.start,
				offset: input.offset
			},
			{
				start: rhs.start,
				length: rhs.length,
				offset: mod.offset
			},
			{
				start: rhs.start + rhs.length,
				length: lhs.start + lhs.length - (rhs.start + rhs.length),
				offset: input.offset
			}
		];
	} else {
		return [{
			...input,
			offset: input.offset
		}]
	}
}

const res = inputRanges.map((inputRange) => {
	return modificationGenerations.reduce((acc, curr, genIdx) => {
		return curr
			.reduce((acc2, curr2) => {
					return acc2.map(v => applyMod(v, curr2)).flat()
				}, acc
					.map(v => ({...v, offset: 0}))
			)
			.map(modded => ({
				start: modded.start + modded.offset,
				length: modded.length
			}));
	}, [inputRange])
})

const nearestLocationExtended = (res
	.map(curr => {
		return curr.min((el) => el.start);
	})
	.min(el => el?.start ?? Number.MAX_VALUE) as InputRange)
	.start

writeResultToFile({
	nearestLocation,
	nearestLocationExtended
})