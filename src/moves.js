/**
 * Parse a solution move string like "e2-e4" or "e7-e8q".
 * @param {string} move
 * @returns {{ source: string, target: string, promotion: string }}
 */
function parseMove(move) {
  let [source, target] = move.split("-");
  let promotion = target.length === 2 ? "q" : target[2];
  target = target.slice(0, 2);
  return { source, target, promotion };
}

module.exports = {
  parseMove
};
