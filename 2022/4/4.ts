import { readLinesFromParam, writeResultToFile } from '../../utils/utils';

const lines = readLinesFromParam().map((line) =>
  line
    .split(',')
    .map((assignment) => assignment.split('-').map((val) => parseInt(val)))
);

const assignmentsWithContainment = lines.filter(
  ([[lhs1, lhs2], [rhs1, rhs2]]) =>
    (lhs1 <= rhs1 && lhs2 >= rhs2) || (rhs1 <= lhs1 && rhs2 >= lhs2)
).length;

const assignmentsWithOverlap = lines.filter(
  ([[lhs1, lhs2], [rhs1, rhs2]]) =>
    (lhs1 >= rhs1 && lhs1 <= rhs2) ||
    (lhs2 >= rhs1 && lhs2 <= rhs2) ||
    (lhs1 <= rhs1 && lhs2 >= rhs2) ||
    (rhs1 <= lhs1 && rhs2 >= lhs2)
).length;

writeResultToFile({
  assignmentsWithContainment,
  assignmentsWithOverlap
});
