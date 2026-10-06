const $ = require("jquery");

const HIGHLIGHT_COLORS = {
  black: "#696969",
  white: "#a9a9a9"
};

function unhighlight() {
  $("#board .square-55d63").css("background", "");
}

function highlight(square) {
  const squareEl = $("#board .square-" + square);
  const color = squareEl.hasClass("black-3c85d")
    ? HIGHLIGHT_COLORS.black
    : HIGHLIGHT_COLORS.white;
  squareEl.css("background", color);
}

function highlightMove(source, target) {
  highlight(source);
  highlight(target);
}

module.exports = {
  unhighlight,
  highlight,
  highlightMove
};
