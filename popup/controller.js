// controller.js
// the data structure storing the comments, supports crud operations, saving/loading, and sorting

class PopupController {

  constructor() {
    this.comments = [];
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
        }).catch(onError);
      }
    }).catch(onError);
  }

  // calls update on view because it is asynchronous
  loadAndUpdateComments() {
    var result;
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(
          tab.id,
          {action: "load"}
        ).then((result) => {
          this.comments = result.comments;
          this.view.updateComments();
        }).catch(onError);
      }
    }).catch(onError);
  }

  setComments(newComments) {
    this.comments = newComments;
  }

  setCommentAt(index, newComment) {
    this.comments[index] = newComment;
  }

  setCommentSelected(index, selected) {
    this.comments[index].selected = selected;
  }

  addComment(comment) {
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
    let c = this.comments.splice(index, 1);
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

}