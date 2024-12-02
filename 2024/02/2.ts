import {readLinesFromParam, writeResultToFile} from "../../utils/utils";

const isReportValid = (report: number[]): boolean => {
	return !!report.reduce((acc, curr, idx, report) => {
		if (acc !== false && idx > 0) {
			const diff = curr - report[idx - 1]
			return Math.abs(diff) >= 1 && Math.abs(diff) <= 3 && ((diff < 0 && report[1] - report[0] < 0) || (diff > 0 && report[1] - report[0] > 0))
		} else {
			return acc
		}
	}, null as boolean | null)
}

const validReports = readLinesFromParam().map((line) => line.split(" ")).filter((report) => {
	return isReportValid(report.map((el) => parseInt(el)))
});

const validReports2 = readLinesFromParam()
	.map((line) => line.split(" "))
	.map((report) => report.map(el => parseInt(el)))
	.filter((report) => {
		return isReportValid(report) || report
			.reduce((acc, curr, idx, report) => {
				if (acc) {
					return acc;
				} else {
					return isReportValid(report.toSpliced(idx, 1))
				}
			}, false)
	});

writeResultToFile({1: validReports.length, 2: validReports2.length});