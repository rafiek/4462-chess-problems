const assert = require("assert");
const { parseMove } = require("./moves.js");
const {
  formatProblemTitle,
  markSolvedTitle,
  getProblemById,
  selectInitialProblem
} = require("./problem.js");

assert.deepStrictEqual(parseMove("e2-e4"), {
  source: "e2",
  target: "e4",
  promotion: "q"
});
assert.deepStrictEqual(parseMove("e7-e8n"), {
  source: "e7",
  target: "e8",
  promotion: "n"
});

const sample = {
  problemid: 3,
  first: "White to Move",
  type: "Mate in Two",
  fen: "8/8/8/8/8/8/8/8 w - - 0 1",
  moves: "a1-a2;b2-b1"
};

assert.strictEqual(
  formatProblemTitle(sample, false),
  "Checkmate in Two Moves - White to Move"
);
assert.strictEqual(
  formatProblemTitle(sample, true),
  "#3 Checkmate in Two Moves - White to Move"
);
assert.strictEqual(
  markSolvedTitle("Checkmate in One Move - White to Move"),
  "Checkmate in One Move  - Solved!"
);

const problems = [
  { problemid: 1 },
  { problemid: 2 },
  sample
];
assert.strictEqual(getProblemById(problems, 3), sample);
assert.strictEqual(getProblemById(problems, 0), null);
assert.strictEqual(getProblemById(problems, 99), null);
assert.strictEqual(selectInitialProblem(problems, { id: "3" }), sample);

console.log("src unit checks passed");
