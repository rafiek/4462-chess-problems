const URI = require("urijs");

function getUrlParameters() {
  return new URI(window.location.href).search(true);
}

function hasOrderedMode(urlParameters) {
  return "o" in urlParameters;
}

function pushProblemState(urlParameters, problemId) {
  if (!(window.history && window.history.pushState && hasOrderedMode(urlParameters))) {
    return;
  }
  urlParameters["id"] = problemId;
  if (window.history.state && window.history.state["id"] === problemId) {
    return;
  }
  window.history.pushState(
    urlParameters,
    "",
    new URI(window.location.href).search(urlParameters).toString()
  );
}

function clearIdFromUrl(urlParameters) {
  if (!(window.history && window.history.replaceState && "id" in urlParameters)) {
    return;
  }
  delete urlParameters["id"];
  window.history.replaceState(
    urlParameters,
    "",
    new URI(window.location.href).search(urlParameters).toString()
  );
}

function problemPermalink(urlParameters, problemId) {
  return hasOrderedMode(urlParameters)
    ? `?o&id=${problemId}`
    : `?id=${problemId}`;
}

module.exports = {
  getUrlParameters,
  hasOrderedMode,
  pushProblemState,
  clearIdFromUrl,
  problemPermalink
};
