const store = Redux.createStore(appReducer);

function setup() {
  ReactDOM.render(
    React.createElement(ReactRedux.Provider, {store: store},
      React.createElement(
        AppContainer,
        null
      )),
    document.getElementById("app")
  );
}

browser.tabs.executeScript({file: "/content_scripts/add-text.js"})
.then(setup);
