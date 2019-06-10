// add-text.js
// receives text from the popup and pastes it into the clipboard

(function() {
  if (window.hasRun) {
    return true;
  }
  window.hasRun = true;

  browser.runtime.onMessage.addListener(async function(request) {
    if (request.action === "paste") {
      navigator.clipboard.writeText(request.text);
    } else { // request is to either save or load
      let result = await browser.runtime.sendMessage(request);
      return result;
    }
  });
})();