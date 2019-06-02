// view.js
// defines GUI logic

// TODO: refactor how indexes are derived from element id, maybe have an idToIndex or idToAction function
// TODO: improve CSS to make extension look better
class PopupView {

  constructor(controller) {
    this.controller = controller;
    this.controller.view = this;
    this.controller.loadAndUpdateComments();
    this.setupButtonBindings();
    this.setupShortcutBindings();
  }

  updateComments() {
    let comments = this.controller.getComments();
    var html = "";
    for (var i = 0; i < comments.length; i++) {
      html += this.commentToHTML(comments[i], i);
    }
    document.getElementById("comment-table").innerHTML = html;
    var self = this;
    for (var i = 0; i < comments.length; i++) {
      this.finalizeCommentAt(i);
    }
  }

  updateCommentAt(index) {
    let html = document.getElementById("comment-table").children[index];
    let active = document.getElementById("button-" + index).classList.contains("active");
    let comment = this.controller.getCommentAt(index);
    html.innerHTML = this.commentToHTML(comment, index, active);
    this.finalizeCommentAt(index);
  }

  updateCommentsAfterDeletionAt(index) {
    let element = document.getElementById("button-" + index);
    element.parentNode.parentNode.removeChild(element.parentNode);
    let length = this.controller.getLength();
    for (var i = index + 1; i < length + 1; i++) {
      let newIndex = i - 1;
      document.getElementById("button-" + i).innerHTML = i;
      document.getElementById("button-" + i).id = "button-" + newIndex;
      document.getElementById("up-button-" + i).id = "up-button-" + newIndex;
      document.getElementById("down-button-" + i).id = "down-button-" + newIndex;
      document.getElementById("edit-button-" + i).id = "edit-button-" + newIndex;
      document.getElementById("delete-button-" + i).id = "delete-button-" + newIndex;
      document.getElementById("text-" + i).id = "text-" + newIndex;
    }
  }

  commentToHTML(comment, index) {
    var buttonHTML;
    if (comment.selected) {
      buttonHTML = "<button class=\"active\" id=\"button-" + index + "\">" + (index + 1) + "</button>";
    } else {
      buttonHTML = "<button class=\"inactive\" id=\"button-" + index + "\">" + (index + 1) + "</button>";
    }
    let textHTML = this.commentToSpan(comment, index);
    let upHTML = "<button class=\"move-button\" id=\"up-button-" + index + "\">&uarr;</button>";
    let downHTML = "<button class=\"move-button\" id=\"down-button-" + index + "\">&darr;</button>";
    let editHTML = "<button class=\"edit-button\" id=\"edit-button-" + index + "\">Edit</button>";
    let deleteHTML = "<button class=\"delete-button\" id=\"delete-button-" + index + "\">X</button>";
    return "<div class=\"comment-row\">" + buttonHTML + textHTML + "<span style=\"float:right\">" + upHTML + downHTML + editHTML + deleteHTML + "</span></div>";
  }

  // TODO: add mouseover text about usage data (e.g. "used N times, last used XX days/hours/minutes ago")
  commentToSpan(comment, index) {
    var html = "<span class=\"comment-text\" id=\"text-" + index + "\">   ";
    for (var i = 0; i < comment.blanks.length; i++) {
      html += "<span>" + comment.texts[i] + "</span><select>";
      for (let option of comment.blanks[i]) {
        html += "<option value =\"" + option + "\">" + option + "</option>";
      }
      html += "</select>";
    }
    html += "<span>" + comment.texts[comment.blanks.length] + "</span></span>";
    return html;
  }

  finalizeCommentAt(index) {
    let self = this;
    let handler = function() { self.handleButtonClick(this.id); };
    document.getElementById("button-" + index).onmouseup = handler;
    document.getElementById("up-button-" + index).onmouseup = handler;
    document.getElementById("down-button-" + index).onmouseup = handler;
    document.getElementById("edit-button-" + index).onmouseup = handler;
    document.getElementById("delete-button-" + index).onmouseup = handler;
  }

  setupButtonBindings() {
    var self = this;
    document.getElementById("button-sort-alpha").onmouseup = function() { self.sortAlpha(); };
    document.getElementById("button-sort-new").onmouseup = function() { self.sortNew(); };
    document.getElementById("button-sort-used").onmouseup = function() { self.sortUsed(); };
    document.getElementById("button-add").onmouseup = function() { self.addComment(); };
    document.getElementById("button-reset").onmouseup = function () { self.deleteAllComments(); };
    document.getElementById("button-finish").onmouseup = finish;
  }

  setupShortcutBindings() {
    document.onkeypress = function(event) {
      if (event.keyCode > 48 && event.keyCode < 58) { // if a number is pressed, toggle that button
        let index = event.keyCode - 49;
        let button = document.getElementById("button-" + index);
        button.dispatchEvent(new Event("mouseup"));
        button.focus();
      } else if (event.keyCode == 10 || event.keyCode == 13 || event.key == 'z') { // if enter or z is pressed, we are done
        finish();
      }
    };
  }

  handleButtonClick(buttonID) {
    if (buttonID.startsWith("b")) {
      let index = parseInt(buttonID.substring(7));
      this.toggleCommentAt(index);
    } else if (buttonID.startsWith("u")) {
      let index = parseInt(buttonID.substring(10));
      this.shiftCommentUp(index);
    } else if (buttonID.startsWith("do")) {
      let index = parseInt(buttonID.substring(12));
      this.shiftCommentDown(index);
    } else if (buttonID.startsWith("e")) {
      let index = parseInt(buttonID.substring(12));
      this.editComment(index);
    } else {
      let index = parseInt(buttonID.substring(14));
      this.deleteCommentAt(index);
    }
  }

  sortAlpha() {
    this.controller.sortAlpha();
    this.updateComments();
  }

  sortNew() {
    this.controller.sortNew();
    this.updateComments();
  }

  sortUsed() {
    this.controller.sortUsed();
    this.updateComments();
  }

  // TODO: add custom update function (i.e. updateCommentAfterAdd) that only modifies last element
  addComment() {
    let text = "New Comment";
    let com = new Comment(text);
    this.controller.addComment(com);
    this.updateComments();
    this.editComment("edit-button-" + (this.controller.getLength() - 1));
  }

  editComment(index) {
    let commentObject = document.getElementById("text-" + index);
    let oldComment = this.controller.getCommentAt(index);
    commentObject.innerHTML = "<textarea rows=\"3\" id=\"edit-" + index + "\">" + oldComment.rawText + "</textarea>";

    // finish with textarea when navigated away or pressed enter
    let newObject = document.getElementById("edit-" + index);
    var self = this;
    newObject.onkeypress = function(event) {
      if (event.keyCode == 10 || event.keyCode == 13) {
        let newComment = new Comment(this.value, oldComment);
        self.controller.setCommentAt(index, newComment);
        self.updateCommentAt(index);
      }
      event.stopPropagation(); // document is listening for shortcuts
    }
    newObject.onchange = function() {
      let newComment = new Comment(this.value, oldComment);
      self.controller.setCommentAt(index, newComment);
      self.updateCommentAt(index);
    }

    // move cursor to end of textarea
    newObject.focus();
    newObject.setSelectionRange(newObject.value.length, newObject.value.length);
  }

  toggleCommentAt(index) {
    let selected = this.controller.getCommentAt(index).selected;
    this.controller.setCommentSelected(index, !selected);
    let button = document.getElementById("button-" + index);
    if (selected) {
      button.classList = ["inactive"];
    } else {
      button.classList = ["active"];
    }
  }

  shiftCommentUp(index) {
    if (index > 0) {
      let comment1 = this.controller.getCommentAt(index);
      let comment2 = this.controller.getCommentAt(index - 1);
      this.controller.setCommentAt(index, comment2);
      this.controller.setCommentAt(index - 1, comment1);
      this.updateCommentAt(index);
      this.updateCommentAt(index - 1);
    }
  }

  shiftCommentDown(index) {
    if (index < this.controller.getLength() - 1) {
      let comment1 = this.controller.getCommentAt(index);
      let comment2 = this.controller.getCommentAt(index + 1);
      this.controller.setCommentAt(index, comment2);
      this.controller.setCommentAt(index + 1, comment1);
      this.updateCommentAt(index);
      this.updateCommentAt(index + 1);
    }
  }

  deleteCommentAt(index) {
    this.controller.deleteCommentAt(index);
    this.updateCommentsAfterDeletionAt(index);
  }

  deleteAllComments() {
    this.controller.deleteAllComments();
    this.updateComments();
  }

  getFinalizedText() {
    let comments = this.controller.getComments();
    var result = "";
    for (var i = 0; i < comments.length; i++) {
      if (comments[i].selected) {
        result += this.processCommentAt(i) + "\r";
        this.controller.onUsedCommentAt(i);
      }
    }
    return result;
  }

  processCommentAt(index) {
    let segments = document.getElementById("text-" + index).children;
    let comment = this.controller.getCommentAt(index);
    var result = "";
    for (var i = 0; i < segments.length; i++) {
      if (i % 2 == 0) {
        result += comment.rawTexts[i / 2];
      } else {
        result += " " + segments[i].value + " ";
      }
    }
    return result.trim(); // texts at left and right ends might be empty strings
  }

}