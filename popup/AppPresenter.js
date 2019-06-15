class AppPresenter extends React.Component {
  constructor(props) {
    super(props);
    this.loadComments();
  }

  saveComments(comments) {
    for (let comment of comments) {
      comment.selected = false;
    }
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(
          tab.id,
          {action: "save", comments: comments}
        ).then((result) => {
          window.close();
        });
      }
    });
  }

  loadComments() {
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(
          tab.id,
          {action: "load"}
        ).then((result) => {
          this.props.load(result.comments);
        });
      }
    });
  }

  processComment(comment) {
    var result = comment.texts[0];
    for (var i = 0; i < comment.actives.length; i++) {
        result += " " + comment.actives[i] + " ";
        result += comment.texts[i + 1];
    }
    return result.trim(); // texts at left and right ends might be empty strings
  }

  getFinalizedText() {
    let comments = this.props.comments;
    var result = "";
    for (var i = 0; i < comments.length; i++) {
      if (comments[i].selected) {
        result += this.processComment(comments[i]) + "\r";
        comments[i].timesUsed += 1;
        comments[i].timeLastUsed = new Date().getTime();
      }
    }
    this.saveComments(comments);
    return result;
  }
  
  finish() {
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(
          tab.id,
          {action: "paste", text: this.getFinalizedText()}
        );
      }
    });
  }

  render() {
    if (this.props.loaded) {
      let commentTableProps = {
        editing: this.props.editing,
        comments: this.props.comments,
        setCommentFunction: this.props.set,
        deleteCommentFunction: this.props.delete,
        finishFunction: this.finish.bind(this),
        selectFunction: this.props.select
      };
      return React.createElement("div", null,
        React.createElement("h1", null, "Comment Manager"),
        React.createElement(SortAlphaButton, {onClickFunction: this.props.sortAlpha}),
        React.createElement(SortNewButton, {onClickFunction: this.props.sortNew}),
        React.createElement(SortUsedButton, {onClickFunction: this.props.sortUsed}),
        React.createElement(AddCommentButton, {onClickFunction: this.props.add}),
        React.createElement(CommentTable, commentTableProps),
        React.createElement(FinishButton, {onClickFunction: this.finish.bind(this)}),
        React.createElement(ResetButton, {onClickFunction: this.props.reset})
      );
    } else {
      return React.createElement("div", {className: "loader"}, "Loading...");
    }
  }
}