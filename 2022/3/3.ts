import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines = readLinesFromParam();

const getPriority = (value: string) => {
    const code = value.charCodeAt(0);
    if (code >= 97 && code <= 122) {
        return code - 96;
    } else if (code >= 65 && code <= 90) {
        return code - 38;
    } else {
        throw new Error();
    }
}

const duplicateItems = lines
    .map(line => [[...line.substring(0, line.length / 2)], [...line.substring(line.length / 2)]])
    .map(([lhs, rhs]) => [...new Set(lhs.filter(item => rhs.includes(item)))])
    .flat();

const duplicatePriorities = duplicateItems
    .reduce((acc, curr) => acc + getPriority(curr), 0);

const groupBadgePriorities = lines
    .reduce((acc, curr, currIdx) => currIdx % 3 === 0 ? [...acc, [curr]] : [...acc.slice(0, -1), [...acc[acc.length - 1], curr]], [] as string[][])
    .map(group => [...group[0]].filter(item => group[1].includes(item)).filter(item => group[2].includes(item)))
    .map(group => [...new Set(group)])
    .flat()
    .map(badge => getPriority(badge))
    .reduce((acc, curr) => acc + curr, 0);

writeResultToFile({
    duplicatePriorities,
    groupBadgePriorities
});