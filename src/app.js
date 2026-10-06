const Chess = require("chess.js");
const $ = require("jquery");
const { ChessBoard } = require("../chessboard/chessboard.js");
const { problems } = require("../problems.json");
const random = require("./random.js");
const { enableScroll, disableScroll } = require("./scroll.js");
const { parseMove } = require("./moves.js");
const { unhighlight, highlightMove } = require("./highlight.js");
const {
  getUrlParameters,
  hasOrderedMode,
  pushProblemState,
  clearIdFromUrl,
  problemPermalink
} = require("./url-state.js");
const {
  formatProblemTitle,
  markSolvedTitle,
  getProblemById,
  selectInitialProblem
} = require("./problem.js");

const TOTAL_PROBLEMS = problems.length;
let urlParameters = getUrlParameters();

let game;
let correctMoves;

function makeMove(board) {
  const { source, target, promotion } = parseMove(correctMoves[0]);
  game.move({ from: source, to: target, promotion });
  board.move(`${source}-${target}`);
  correctMoves.shift();
}

function nextProblem(board) {
  changeProblem(board, 1);
}

function previousProblem(board) {
  changeProblem(board, -1);
}

function changeProblem(board, direction) {
  const currentProblemId = parseInt(
    document.querySelector("#problem-num").innerHTML,
    10
  );
  if (
    hasOrderedMode(urlParameters) &&
    currentProblemId !== (direction === 1 ? TOTAL_PROBLEMS : 1)
  ) {
    const nextProblemData = problems[currentProblemId - 1 + direction];
    next(board, nextProblemData);
    pushProblemState(urlParameters, nextProblemData.problemid);
  } else if (direction === 1) {
    next(board);
    clearIdFromUrl(urlParameters);
  }
}

function onDropHandler(board, src, tgt) {
  enableScroll();

  if (game.in_checkmate()) {
    return "snapback";
  }

  const { source, target, promotion } = parseMove(correctMoves[0]);

  if (correctMoves.length === 1) {
    const simGame = new Chess(game.fen());
    simGame.move({ from: src, to: tgt, promotion });

    if (!simGame.in_checkmate()) {
      return "snapback";
    }
    game.move({ from: src, to: tgt, promotion });
    correctMoves.shift();
  } else {
    if (src !== source || tgt !== target) {
      return "snapback";
    }
    game.move({ from: source, to: target, promotion });
    correctMoves.shift();
    setTimeout(() => makeMove(board), 500);
  }

  if (game.in_checkmate()) {
    $("#hint-btn").css("display", "none");
    $("#next-btn").css("display", "");
    document.querySelector("#next-btn").onclick = () => nextProblem(board);
    document.querySelector("#problem-title").innerHTML = markSolvedTitle(
      document.querySelector("#problem-title").innerHTML
    );
  }
}

function next(board, problem = null, useAnimation = true) {
  const selected = problem || random.choice(problems);
  unhighlight();
  $("#next-btn").css("display", "none");
  $("#hint-btn").css("display", "");
  const problemTitle = formatProblemTitle(
    selected,
    hasOrderedMode(urlParameters)
  );
  document.title = `#${selected.problemid}`;
  document.querySelector("#problem-title").innerHTML = problemTitle;
  document.querySelector("#problem-num").innerHTML = `${selected.problemid}`;
  document.querySelector("#problem-link").href = problemPermalink(
    urlParameters,
    selected.problemid
  );
  game = new Chess(selected.fen);
  board.position(selected.fen, useAnimation);
  correctMoves = selected.moves.split(";");
  document.querySelector("#hint-btn").onclick = function() {
    const { source, target } = parseMove(correctMoves[0]);
    highlightMove(source, target);
  };
}

function bindKeyboard(board) {
  document.body.onkeydown = function(e) {
    e.preventDefault();

    if (game.in_checkmate() && (e.key === " " || e.code === "Space")) {
      nextProblem(board);
      return;
    }

    if (e.key === " " || e.code === "Space") {
      const { source, target } = parseMove(correctMoves[0]);
      unhighlight();
      highlightMove(source, target);
    }

    if (e.code === "ArrowRight") {
      nextProblem(board);
    }

    if (e.code === "ArrowLeft") {
      previousProblem(board);
    }
  };
}

function init() {
  const board = ChessBoard("board", {
    draggable: true,
    dropOffBoard: "snapback",
    onDragStart: () => disableScroll(),
    onDrop: (src, tgt) => onDropHandler(board, src, tgt),
    onMoveEnd: () => board.position(game.fen()),
    onSnapEnd: () => {
      board.position(game.fen());
      unhighlight();
    }
  });

  bindKeyboard(board);

  const problem = selectInitialProblem(problems, urlParameters);
  next(board, problem);
  pushProblemState(urlParameters, problem.problemid);

  window.onpopstate = function(event) {
    if (event.state && "id" in event.state) {
      const problemData = getProblemById(problems, event.state["id"]);
      if (problemData) {
        next(board, problemData, false);
      }
    }
  };
}

module.exports = {
  init
};
