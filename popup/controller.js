// controller.js
// the data structure storing the comments, supports crud operations, saving/loading, and sorting

class PopupController {

  constructor() {
    this.comments = [];

    this.finish = this.finish.bind(this);
  }

  saveComments() {
    for (let comment of this.comments) {
      comment.selected = false;
    }
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(
          tab.id,
          {action: "save", comments: this.comments}
        ).then((result) => {
          window.close();
        });
      }
    });
  }

  // calls update on view because it is asynchronous
  loadAndUpdateComments() {
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(
          tab.id,
          {action: "load"}
        ).then((result) => {
          if (result.comments) {
            this.comments = result.comments;
            this.view.updateComments();
          }
        });
      }
    });
  }

  setComments(newComments) {
    this.comments = newComments;
  }

  setCommentAt(index, newComment) {
    this.comments[index] = newComment;
  }

  appendComment(comment) {
    this.comments.push(comment);
  }

  getComments() {
    return this.comments;
  }

  getCommentAt(index) {
    return this.comments[index];
  }

  getLength() {
    return this.comments.length;
  }

  deleteCommentAt(index) {
    this.comments.splice(index, 1);
  }

  deleteAllComments() {
    this.comments = [];
  }

  onUsedCommentAt(index) {
    this.comments[index].timesUsed += 1;
    this.comments[index].timeLastUsed = new Date().getTime();
  }

  sortAlpha() {
    this.comments.sort(this.compareAlpha);
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
    this.comments.sort(this.compareNew);
  }

  compareNew(first, second) {
    return second.timeLastUsed - first.timeLastUsed;
  }

  sortUsed() {
    this.comments.sort(this.compareUsed);
  }

  compareUsed(first, second) {
    return second.timesUsed - first.timesUsed;
  }

  processCommentAt(index) {
    let comment = this.comments[index];
    var result = comment.texts[0];
    for (var i = 0; i < comment.actives.length; i++) {
      result += " " + comment.actives[i] + " ";
      result += comment.rawTexts[i + 1];
    }
    return result.trim(); // texts at left and right ends might be empty strings
  }

  getFinalizedText() {
    var result = "";
    for (var i = 0; i < this.comments.length; i++) {
      if (this.comments[i].selected) {
        result += this.processCommentAt(i) + "\r";
        this.onUsedCommentAt(i);
      }
    }
    return result;
  }
  
  finish() {
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(
          tab.id,
          {action: "paste", text: this.getFinalizedText()}
        ).then(() => {
          this.saveComments();
        });
      }
    });
  }

}
