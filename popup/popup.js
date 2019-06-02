function setupMVC() {
  mainController = new PopupController();
  mainView = new PopupView(mainController);
}

function sendTextToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {action: "paste", text: mainView.getFinalizedText()}
    ).then((response) => {
      mainController.saveComments();
    }).catch(onError);
  }
}

function finish() {
  browser.tabs.query({currentWindow: true, active: true})
  .then(sendTextToTabs)
  .catch(onError);
}

browser.tabs.executeScript({file: "/content_scripts/add-text.js"})
.then(setupMVC)
.catch(onError);