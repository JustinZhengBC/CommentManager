// background.js
// listens to extension for instructions to save or load comments in browser storage

browser.runtime.onMessage.addListener(async function(request) {
  if (request.action === "save") {
    browser.storage.sync.set({comments: request.comments});
  } else if (request.action === "load") {
    let result = await browser.storage.sync.get("comments");
    return result;
  }
});
