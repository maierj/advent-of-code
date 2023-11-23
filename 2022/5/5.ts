import {getNumberRange, readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines = readLinesFromParam()

const separatorLineIndex = lines.findIndex(line => line.trim() === "");
const stackLines = lines.slice(0, separatorLineIndex);
const moveLines = lines.slice(separatorLineIndex + 1);

const numberOfColumns = stackLines.pop()?.split("   ").map(val => val.trim()).length!;
const stacks = stackLines
    .map(line => line
        .split("")
        .reduce((acc, curr, currIdx) => {
            const accIdx = Math.floor(currIdx / 4);
            return accIdx === acc.length ? [...acc, curr] : [...(acc.slice(0, -1)), `${acc[accIdx]}${curr}`];
        }, [] as string[])
        .map(el => el.trim())
    )
    .reduce((acc, curr) => {
        curr
            .forEach((crate, columnIdx) => {
                if (crate !== "") {
                    acc[columnIdx].unshift(crate)
                }
            })

        return acc
    }, getNumberRange(numberOfColumns).map(() => [] as string[]));

const reorderedStacks9000 = [...stacks.map(stack => [...stack])];
const reorderedStacks9001 = [...stacks.map(stack => [...stack])];

moveLines
    .map(move => move.split(" "))
    .forEach(move => {
        const reorderStack = [];
        for (const moveIdx of getNumberRange(parseInt(move[1]))) {
            reorderedStacks9000[parseInt(move[5]) - 1].push(reorderedStacks9000[parseInt(move[3]) - 1].pop()!)
            reorderStack.unshift(reorderedStacks9001[parseInt(move[3]) - 1].pop()!)
        }

        reorderedStacks9001[parseInt(move[5]) - 1].push(...reorderStack)
    });

const stackTops9000 = reorderedStacks9000.map(stack => stack[stack.length - 1][1]).join("");
const stackTops9001 = reorderedStacks9001.map(stack => stack[stack.length - 1][1]).join("");

writeResultToFile({
    stackTops9000,
    stackTops9001
})