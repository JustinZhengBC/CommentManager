class CommentTable extends React.Component {
  constructor(props) {
    super(props);
    this.setupShortcutBindings();
  }
  
  toggleButtonAt(index) {
    let comment = this.props.comments[index];
    comment.selected = !comment.selected;
    this.props.setCommentFunction(index, comment);
  }

  changeCommentAt(index, newComment) {
    this.props.setCommentFunction(index, newComment);
  }

  shiftUpAt(index) {
    if (index > 0) {
      let comment1 = this.props.comments[index];
      let comment2 = this.props.comments[index - 1];
      this.props.setCommentFunction(index, comment2);
      this.props.setCommentFunction(index - 1, comment1);
    }
  }

  shiftDownAt(index) {
    if (index < this.props.comments.length - 1) {
      let comment1 = this.props.comments[index];
      let comment2 = this.props.comments[index + 1];
      this.props.setCommentFunction(index, comment2);
      this.props.setCommentFunction(index + 1, comment1);
    }
  }

  deleteAt(index) {
    this.props.deleteCommentFunction(index);
  }
  
  setupShortcutBindings() {
    let toggle = this.toggleButtonAt.bind(this);
    let finish = this.props.finishFunction;
    document.onkeypress = function(event) {
      if (event.keyCode > 48 && event.keyCode < 58) { // if a number is pressed, toggle that button
        let index = event.keyCode - 49;
        toggle(index);
        let button = document.getElementById("button-" + index);
        button.focus();
      } else if (event.keyCode == 10 || event.keyCode == 13 || event.key == 'z') { // if enter or z is pressed, we are done
        finish();
      }
    };
}

  render() {
    let rows = [];
    for (var i = 0; i < this.props.comments.length; i++) {
      rows.push(
        React.createElement(
          Row,
          {
            index: i,
            comment: this.props.comments[i],
            toggleFunction: this.toggleButtonAt.bind(this),
            shiftUpFunction: this.shiftUpAt.bind(this),
            shiftDownFunction: this.shiftDownAt.bind(this),
            editFunction: this.changeCommentAt.bind(this),
            deleteFunction: this.deleteAt.bind(this)
          }
        )
      );
    }
    return React.createElement("div", null, ...rows);
  }
}