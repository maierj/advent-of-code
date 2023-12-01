import {readLinesFromParam, writeResultToFile} from '../../utils/utils';

const lines = readLinesFromParam();

class File {
	constructor(
		public readonly name: string,
		public readonly size: number,
		public readonly isDir: boolean,
		public children: File[],
		public parent: File | null
	) {
		children.forEach((child) => {
			child.parent = this;
		});
	}

	withoutCircularDeps(): any {
		return {
			...this,
			children: this.children.map((child) => child.withoutCircularDeps()),
			parent: undefined
		};
	}

	toString() {
		return JSON.stringify(this.withoutCircularDeps(), null, 2);
	}

	getSize(): number {
		return (
			this.size +
			this.children
				.map((child) => child.getSize())
				.reduce((acc, curr) => acc + curr, 0)
		);
	}

	getChildDirectoriesSmallerThan(sizeLimit: number): File[] {
		const childrenBelowLimit = this.children
			.filter((child) => child.isDir)
			.filter((child) => child.getSize() <= sizeLimit);

		return [
			...childrenBelowLimit,
			...this.children
				.map((child) => child.getChildDirectoriesSmallerThan(sizeLimit))
				.flat()
		];
	}

	getSmallestSubDirAbove(minSize: number): File | null {
		const relevantSubDirs = this.children
			.filter((child) => child.isDir)
			.filter((child) => child.getSize() >= minSize);
		const smallestRelevantSubDir = relevantSubDirs.reduce(
			(acc, curr) =>
				acc === null || acc.getSize() > curr.getSize() ? curr : acc,
			null as File | null
		);

		const candidates = [
			smallestRelevantSubDir,
			...relevantSubDirs
				.map((child) => child.getSmallestSubDirAbove(minSize))
				.flat()
				.filter((child) => child !== null)
		];

		return candidates.reduce(
			(acc, curr) =>
				acc === null || (curr && acc.getSize() >= curr.getSize()) ? curr : acc,
			null as File | null
		);
	}
}

const fs = new File('root', 0, true, [new File('/', 0, true, [], null)], null);

lines.reduce(
	(cwd, curr) => {
		const cdMatch = curr.match(/^\$ cd (.*)$/);
		const lsMatch = curr.match(/^\$ ls$/);
		const fileMatch = curr.match(/^(dir|[0-9]+) (.*)$/);

		if (cdMatch?.length) {
			if (cdMatch[1] === '..') {
				console.log(`Move to ${cwd?.parent?.name ?? ''}`);
				return cwd?.parent ?? null;
			} else {
				if (cwd) {
					const targetDir = cwd?.children?.find((file: File) => file.name === cdMatch[1]) ?? null;
					console.log(
						`Move to ${
							targetDir?.name
						}`
					);
					return targetDir;
				} else {
					return cwd;
				}
			}
		} else if (lsMatch?.length) {
			// no-op
			return cwd;
		} else if (fileMatch?.length) {
			const isDir = fileMatch[1] === 'dir';
			const fileName = fileMatch[2];

			const existingChild = fs.children.find(
				(child) => child.name === fileName && child.isDir === isDir
			);
			if (!existingChild) {
				const newChild = new File(
					fileName,
					isDir ? 0 : parseInt(fileMatch[1]),
					isDir,
					[],
					cwd
				);
				cwd?.children.push(newChild);
			}

			return cwd;
		} else {
			return cwd;
		}
	},
	fs as File | null
);

const directoriesUnderThreshold = fs.getChildDirectoriesSmallerThan(100000);
const totalSizeOfDirectoriesUnderThreshold = directoriesUnderThreshold
	.map((dir) => dir?.getSize())
	.reduce((acc, curr) => acc + curr, 0);

const totalDiskSpace = 70000000;
const requiredUnusedSpace = 30000000;
const requiredSpace = requiredUnusedSpace - (totalDiskSpace - fs.getSize());
const smallestSubDirAbove = fs.getSmallestSubDirAbove(requiredSpace);

writeResultToFile({
	totalSizeOfDirectoriesUnderThreshold,
	smallestSubDirAboveSize: smallestSubDirAbove?.getSize()
});
