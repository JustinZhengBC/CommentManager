class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {comments: [], loaded: false};
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
          if (result) {
            this.setState({comments: result.comments, loaded: true});
          } else {
            this.setState({loaded: true});
          }
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
    let comments = this.state.comments;
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

  setCommentAt(index, newComment) {
    let comments = this.state.comments;
    comments[index] = newComment;
    this.setState({comments: comments});
  }

  addComment() {
    let comments = this.state.comments;
    let newComment = new Comment("New Comment");
    newComment.justMade = true;
    comments.push(newComment);
    this.setState({comments: comments});
  }

  deleteCommentAt(index) {
    let comments = this.state.comments;
    comments.splice(index, 1);
    this.setState({comments: comments});
  }

  deleteAllComments() {
    this.setState({comments: []});
  }

  sortAlpha() {
    let comments = this.state.comments;
    comments.sort(this.compareAlpha);
    this.setState({comments: comments});
  }

  compareAlpha(first, second) {
    if (first.texts[0] === second.texts[0]) {
      return 0;
    } else if (first.texts[0] < second.texts[0]) {
      return -1;
    } else {
      return 1;
    }
  }

  sortNew() {
    let comments = this.state.comments;
    comments.sort(this.compareNew);
    this.setState({comments: comments});
  }

  compareNew(first, second) {
    return second.timeLastUsed - first.timeLastUsed;
  }

  sortUsed() {
    let comments = this.state.comments;
    comments.sort(this.compareUsed);
    this.setState({comments: comments});
  }

  compareUsed(first, second) {
    return second.timesUsed - first.timesUsed;
  }

  render() {
    if (this.state.loaded) {
      let commentTableProps = {
        comments: this.state.comments,
        setCommentFunction: this.setCommentAt.bind(this),
        deleteCommentFunction: this.deleteCommentAt.bind(this),
        finishFunction: this.finish.bind(this)
      };
      return React.createElement("div", null,
        React.createElement("h1", null, "Comment Manager"),
        React.createElement(SortAlphaButton, {onClickFunction: this.sortAlpha.bind(this)}),
        React.createElement(SortNewButton, {onClickFunction: this.sortNew.bind(this)}),
        React.createElement(SortUsedButton, {onClickFunction: this.sortUsed.bind(this)}),
        React.createElement(AddCommentButton, {onClickFunction: this.addComment.bind(this)}),
        React.createElement(CommentTable, commentTableProps),
        React.createElement(FinishButton, {onClickFunction: this.finish.bind(this)}),
        React.createElement(ResetButton, {onClickFunction: this.deleteAllComments.bind(this)})
      );
    } else {
      return React.createElement("div", {className: "loader"}, "Loading...");
    }
  }
}