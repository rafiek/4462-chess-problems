const random = require("./random.js");

function formatProblemTitle(problem, includeId) {
  const problemType = `Checkm${problem.type.slice(1)} Move${
    problem.type.endsWith("One") ? "" : "s"
  }`;
  let title = `${problemType} - ${problem.first}`;
  if (includeId) {
    title = `#${problem.problemid} ${title}`;
  }
  return title;
}

function markSolvedTitle(currentTitle) {
  return currentTitle.split("-")[0] + " - Solved!";
}

function getProblemById(problems, problemId) {
  const id = parseInt(problemId, 10);
  if (!(id > 0 && id <= problems.length)) {
    return null;
  }
  return problems[id - 1];
}

function selectInitialProblem(problems, urlParameters) {
  if ("id" in urlParameters) {
    const problem = getProblemById(problems, urlParameters["id"]);
    if (problem) {
      return problem;
    }
  }
  return random.choice(problems);
}

module.exports = {
  formatProblemTitle,
  markSolvedTitle,
  getProblemById,
  selectInitialProblem
};
