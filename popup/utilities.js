function onError(error) {
  alert(`Error: ${error}`);
}

function sanitize(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\{/g, "{");
}