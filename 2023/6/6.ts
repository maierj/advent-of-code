import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const lines = readLinesFromParam()

type Race = {
	time: number
	distance: number
}

const races = lines.reduce((acc, curr, currIdx) => {
	const v = curr.split(":")[1].split(" ").map(v => v.trim()).filter(v => v !== "");
	if (currIdx === 0) {
		return v.map(x => ({time: parseInt(x), distance: 0}))
	} else {
		return v.map((x, idx) => ({...acc[idx], distance: parseInt(x)}))
	}
}, [] as Race[])

const longRaces = lines.reduce((acc, curr, currIdx) => {
	const v = curr.replaceAll(" ", "").split(":")[1].split(" ").map(v => v.trim()).filter(v => v !== "");
	if (currIdx === 0) {
		return v.map(x => ({time: parseInt(x), distance: 0}))
	} else {
		return v.map((x, idx) => ({...acc[idx], distance: parseInt(x)}))
	}
}, [] as Race[])

const getDistance = (pushTime: number, totalTime: number) => {
	return (totalTime - pushTime) * pushTime
}

const numberOfWaysToWin = races.map(race => {
	let minPushTimeToWin = null;
	let maxPushTimeToWin = null;

	let pushTime = 0
	while (minPushTimeToWin === null && pushTime <= race.time) {
		if (getDistance(pushTime, race.time) > race.distance) {
			minPushTimeToWin = pushTime
		}

		pushTime++;
	}

	pushTime = race.time
	while (maxPushTimeToWin === null && pushTime >= minPushTimeToWin!) {
		if (getDistance(pushTime, race.time) > race.distance) {
			maxPushTimeToWin = pushTime
		}

		pushTime--;
	}

	return maxPushTimeToWin! - minPushTimeToWin! + 1
}).reduce((acc, curr) => acc * curr, 1);

const numberOfWaysToWinLong = longRaces.map(race => {
	let minPushTimeToWin = null;
	let maxPushTimeToWin = null;

	let pushTime = 0
	while (minPushTimeToWin === null && pushTime <= race.time) {
		if (getDistance(pushTime, race.time) > race.distance) {
			minPushTimeToWin = pushTime
		}

		pushTime++;
	}

	pushTime = race.time
	while (maxPushTimeToWin === null && pushTime >= minPushTimeToWin!) {
		if (getDistance(pushTime, race.time) > race.distance) {
			maxPushTimeToWin = pushTime
		}

		pushTime--;
	}

	return maxPushTimeToWin! - minPushTimeToWin! + 1
}).reduce((acc, curr) => acc * curr, 1);

writeResultToFile({
	numberOfWaysToWin,
	numberOfWaysToWinLong
})