// view.js
// defines GUI logic

class PopupView {

  constructor(controller) {
    this.controller = controller;
    this.controller.view = this;
    this.controller.loadAndUpdateComments();
    this.setupButtonBindings();
    this.setupShortcutBindings();

    this.table = document.getElementById("comment-table");
  }

  updateComments(start = 0) {
    this.clearNodes(start);
    let comments = this.controller.getComments();
    for (var i = start; i < comments.length; i++) {
      this.table.appendChild(this.commentToElement(comments[i], i));
    }
  }

  updateCommentAt(index) {
    let oldChild = this.table.children[index];
    let comment = this.controller.getCommentAt(index);
    let newChild = this.commentToElement(comment, index);
    this.table.replaceChild(newChild, oldChild);
  }

  commentToElement(comment, index) {
    let element = document.createElement("div");
    element.classList = ["comment-row"];
  
    let toggleButton = document.createElement("button");
    toggleButton.id = "button-" + index;
    toggleButton.innerHTML = index + 1;
    toggleButton.classList = [comment.selected ? "active" : "inactive"];
    toggleButton.onmouseup = this.toggleCommentAt.bind(this, index);
    element.appendChild(toggleButton);

    element.appendChild(this.commentToSpan(comment, index));

    let upElement = document.createElement("button");
    upElement.classList = ["move-button"];
    upElement.innerHTML = "&uarr;";
    upElement.onmouseup = this.shiftCommentUp.bind(this, index);
    element.appendChild(upElement);

    let downElement = document.createElement("button");
    downElement.classList = ["move-button"];
    downElement.innerHTML = "&darr;";
    downElement.onmouseup = this.shiftCommentDown.bind(this, index);
    element.appendChild(downElement);

    let editElement = document.createElement("button");
    editElement.classList = ["edit-button"];
    editElement.innerHTML = "Edit";
    editElement.onmouseup = this.editCommentAt.bind(this, index);
    element.appendChild(editElement);

    let deleteElement = document.createElement("button");
    deleteElement.classList = ["delete-button"];
    deleteElement.innerHTML = "X";
    deleteElement.onmouseup = this.deleteCommentAt.bind(this, index);
    element.appendChild(deleteElement);
    
    return element;
  }

  commentToSpan(comment, index) {
    let element = document.createElement("span");
    element.classList = ["comment-text"];
    element.title = "Used " + comment.timesUsed + " times";

    let handler = function(event) {
      let editedComment = this.controller.getCommentAt(index);
      let optionsIndex = parseInt(event.target.id);
      editedComment.actives[optionsIndex] = event.target.value;
      this.controller.setCommentAt(index, editedComment);
    }
  
    for (var i = 0; i < comment.blanks.length; i++) {
      let text = document.createTextNode(comment.texts[i]);
      element.appendChild(text);
  
      let selectElement = document.createElement("select");
      selectElement.id = i.toString();
      selectElement.onchange = handler.bind(this);
      for (let option of comment.blanks[i]) {
        let optionElement = document.createElement("option");
        optionElement.innerHTML = option;
        if (option == comment.actives[i]) {
          optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
      }
      element.appendChild(selectElement);
    }

    let finalText = document.createTextNode(comment.texts[comment.blanks.length]);
    element.appendChild(finalText);

    return element;
  }

  setupButtonBindings() {
    document.getElementById("button-sort-alpha").onmouseup = this.sortAlpha.bind(this);
    document.getElementById("button-sort-new").onmouseup = this.sortNew.bind(this);
    document.getElementById("button-sort-used").onmouseup = this.sortUsed.bind(this);
    document.getElementById("button-add").onmouseup = this.addComment.bind(this);
    document.getElementById("button-reset").onmouseup = this.deleteAllComments.bind(this);
    document.getElementById("button-finish").onmouseup = this.controller.finish;
  }

  setupShortcutBindings() {
    let handler = function(event) {
      if (event.keyCode > 48 && event.keyCode < 58) { // if a number is pressed, toggle that button
        let index = event.keyCode - 49;
        this.toggleCommentAt(index);
        let button = document.getElementById("button-" + index);
        button.focus();
      } else if (event.keyCode == 10 || event.keyCode == 13 || event.key == 'z') { // if enter or z is pressed, we are done
        this.controller.finish();
      }
    };
    document.onkeypress = handler.bind(this);
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

  addComment() {
    let com = new Comment("");
    let numComments = this.controller.getLength();
    this.controller.appendComment(com);
    this.updateComments(numComments);
    this.editCommentAt(numComments);
  }

  editCommentAt(index) {
    let oldComment = this.controller.getCommentAt(index);
    let commentObject = this.table.children[index];
    let oldChild = commentObject.children[1];
    let newChild = document.createElement("textarea");
    newChild.rows = 3;
    newChild.placeholder = "Type comment here";
    newChild.value = oldComment.rawText;
    commentObject.replaceChild(newChild, oldChild);

    // finish with textarea when navigated away or pressed enter
    var self = this;
    newChild.onkeypress = function(event) {
      if (event.keyCode == 10 || event.keyCode == 13) {
        let newComment = new Comment(this.value, oldComment);
        self.controller.setCommentAt(index, newComment);
        self.updateCommentAt(index);
      }
      event.stopPropagation(); // document is listening for shortcuts
    }
    newChild.onchange = function() {
      let newComment = new Comment(this.value, oldComment);
      self.controller.setCommentAt(index, newComment);
      self.updateCommentAt(index);
    }

    // move cursor to end of textarea
    newChild.focus();
    newChild.setSelectionRange(newObject.value.length, newObject.value.length);
  }

  toggleCommentAt(index) {
    let comment = this.controller.getCommentAt(index);
    comment.selected = !comment.selected;
    this.controller.setCommentAt(index, comment);
    this.updateCommentAt(index);
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
    this.updateComments(index);
  }

  deleteAllComments() {
    this.controller.deleteAllComments();
    this.clearNodes();
  }

  clearNodes(start = 0) {
    while (this.table.children[start]) {
      this.table.removeChild(this.table.children[start]);
    }
  }

}
