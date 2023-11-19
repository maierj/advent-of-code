import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

type Move = "Rock" | "Paper" | "Scissors";
type Outcome = "Win" | "Draw" | "Loss";

const OpponentMove = new Map<"A" | "B" | "C", Move>([
    ["A", "Rock"],
    ["B", "Paper"],
    ["C", "Scissors"]
]);

const OwnMove = new Map<"X" | "Y" | "Z", Move>([
    ["X", "Rock"],
    ["Y", "Paper"],
    ["Z", "Scissors"]
]);

const DesiredOutcome = new Map<"X" | "Y" | "Z", Outcome>([
    ["X", "Loss"],
    ["Y", "Draw"],
    ["Z", "Win"]
]);

const Outcomes = new Map<Move, Map<Move, Outcome>>([
    ["Rock", new Map([
        ["Rock", "Draw"],
        ["Paper", "Win"],
        ["Scissors", "Loss"]
    ])],
    ["Paper", new Map([
        ["Rock", "Loss"],
        ["Paper", "Draw"],
        ["Scissors", "Win"]
    ])],
    ["Scissors", new Map([
        ["Rock", "Win"],
        ["Paper", "Loss"],
        ["Scissors", "Draw"]
    ])]
])

const PointsPerMove = new Map<Move, number>([
    ["Rock", 1],
    ["Paper", 2],
    ["Scissors", 3]
]);

const PointsPerOutcome = new Map<Outcome, number>([
    ["Win", 6],
    ["Draw", 3],
    ["Loss", 0],
]);

const lines = readLinesFromParam();

const totalPointsOption1 = lines.map(line => line.split(" ")).reduce((acc, curr) => {
    const opponentMove = OpponentMove.get(curr[0] as "A" | "B" | "C")!;
    const ownMove = OwnMove.get(curr[1] as "X" | "Y" | "Z")!;
    const outcome = Outcomes.get(opponentMove)?.get(ownMove)!

    return acc + PointsPerOutcome.get(outcome)! + PointsPerMove.get(ownMove)!
}, 0)

const totalPointsOption2 = lines.map(line => line.split(" ")).reduce((acc, curr) => {
    const opponentMove = OpponentMove.get(curr[0] as "A" | "B" | "C")!;
    const desiredOutcome = DesiredOutcome.get(curr[1] as "X" | "Y" | "Z")!;
    const move = [...Outcomes.get(opponentMove)?.entries() ?? []].find(([move, outcome]) => outcome === desiredOutcome)?.[0];

    return acc + PointsPerOutcome.get(desiredOutcome)! + PointsPerMove.get(move!)!
}, 0)

writeResultToFile({
    totalPointsOption1,
    totalPointsOption2
});