class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editing: props.comment.justMade};
  }

  edit() {
    this.setState({editing: true});
  }

  onTextAreaChange(event) {
    let newComment = new Comment(event.target.value, this.props.comment);
    this.setState({editing: false});
    this.props.editFunction(this.props.index, newComment);
  }

  onTextAreaKeyDown(event) {
    if (event.keyCode == 10 || event.keyCode == 13) {
      let newComment = new Comment(event.target.value, this.props.comment);
      this.setState({editing: false});
      this.props.editFunction(this.props.index, newComment);
    }
    event.stopPropagation(); // document is listening for shortcuts
  }

  onOptionChange(event) {
    let editedComment = this.props.comment;
    let index = parseInt(event.target.id);
    editedComment.actives[index] = event.target.value;
    this.props.editFunction(this.props.index, editedComment);
  }

  // automatically move cursor to textarea being used to edit a comment
  componentDidUpdate() {
    let area = document.getElementById("editing");
    if (area) {
      area.focus();
      area.setSelectionRange(area.value.length, area.value.length);
    }
  }

  render() {
    var mainElement;
    if (this.state.editing) {
      mainElement = React.createElement(
        "textarea",
        {
          id: "editing",
          rows: 3,
          onBlur: this.onTextAreaChange.bind(this),
          onKeyDown: this.onTextAreaKeyDown.bind(this)
        },
        this.props.comment.rawText
      );
    } else {
      var children = [];
      for (var i = 0; i < this.props.comment.blanks.length; i++) {
        children.push(React.createElement("span", null, this.props.comment.texts[i]));
        var options = [];
        for (let option of this.props.comment.blanks[i]) {
          if (option == this.props.comment.actives[i]) {
            options.push(React.createElement("option", {value: option, selected: true}, option));
          } else {
            options.push(React.createElement("option", {value: option}, option));
          }
        }
        children.push(React.createElement("select", {id: i.toString(), onChange: this.onOptionChange.bind(this)}, ...options));
      }
      children.push(React.createElement("span", null, this.props.comment.texts[this.props.comment.blanks.length]));
      mainElement = React.createElement("span", {className: "comment-text"}, ...children);
    }
    return React.createElement(
      "div",
      null,
      React.createElement(SelectorButton, {onClickFunction: () => {this.props.toggleFunction(this.props.index)}, active: this.props.comment.selected, index: this.props.index}),
      mainElement,
      React.createElement(UpButton, {onClickFunction: () => {this.props.shiftUpFunction(this.props.index)}}),
      React.createElement(DownButton, {onClickFunction: () => {this.props.shiftDownFunction(this.props.index)}}),
      React.createElement(EditButton, {onClickFunction: this.edit.bind(this)}),
      React.createElement(DeleteButton, {onClickFunction: () => {this.props.deleteFunction(this.props.index)}})
    );
  }
}