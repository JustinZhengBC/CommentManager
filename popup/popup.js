function setup() {
  ReactDOM.render(
    React.createElement(
      App,
      null
    ),
    document.getElementById("app")
  );
}

browser.tabs.executeScript({file: "/content_scripts/add-text.js"})
.then(setup);
