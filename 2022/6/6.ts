import { readLinesFromParam, writeResultToFile } from '../../utils/utils';

const startOfPacketUniqueCharacterCount1 = 4;
const startOfPacketUniqueCharacterCount2 = 14;

const packetStartIndex1 = readLinesFromParam()
  .map((line) => line.split(''))
  .map((line) =>
    line.reduce(
      (acc, curr, currIdx, characters) => {
        const uniqueCharacterCount = new Set(
          characters.slice(
            currIdx,
            currIdx + startOfPacketUniqueCharacterCount1
          )
        ).size;
        return (
          acc ??
          (uniqueCharacterCount === startOfPacketUniqueCharacterCount1
            ? currIdx + startOfPacketUniqueCharacterCount1
            : null)
        );
      },
      null as null | number
    )
  );

const packetStartIndex2 = readLinesFromParam()
  .map((line) => line.split(''))
  .map((line) =>
    line.reduce(
      (acc, curr, currIdx, characters) => {
        const uniqueCharacterCount = new Set(
          characters.slice(
            currIdx,
            currIdx + startOfPacketUniqueCharacterCount2
          )
        ).size;
        return (
          acc ??
          (uniqueCharacterCount === startOfPacketUniqueCharacterCount2
            ? currIdx + startOfPacketUniqueCharacterCount2
            : null)
        );
      },
      null as null | number
    )
  );

writeResultToFile({
  packetStartIndex1,
  packetStartIndex2
});
