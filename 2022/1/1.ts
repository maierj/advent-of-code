import {readFileFromParam, writeResultToFile} from "../../utils/utils";

const input = readFileFromParam()

const caloriesPerElve = input
    .split("\n")
    .reduce((acc, curr) => {
        return curr.trim() === "" ? [...acc, 0] : [...acc.slice(0, -1), acc[acc.length - 1] + parseInt(curr)]
    }, [0]);

const topN = (values: number[], n: number) => {
    return values.sort((lhs, rhs) => rhs - lhs).slice(0, n);
}

const mostCaloriesPerElve = topN(caloriesPerElve, 1)[0]
const top3ElveCalories = topN(caloriesPerElve, 3).reduce((acc, curr) => acc + curr, 0);

writeResultToFile({
    mostCaloriesPerElve,
    top3ElveCalories
});