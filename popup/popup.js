function setupMVC() {
  mainController = new PopupController();
  mainView = new PopupView(mainController);
}

browser.tabs.executeScript({file: "/content_scripts/add-text.js"})
.then(setupMVC);
