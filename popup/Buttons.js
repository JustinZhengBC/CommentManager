function makeButtonComponent(classText, buttonText) {
  return (props) => {
    return React.createElement(
      "button",
      {className: classText, onMouseUp: props.onClickFunction},
      buttonText
    );
  };
}

const UpButton = makeButtonComponent("move-button", "↑");
const DownButton = makeButtonComponent("move-button", "↓");
const EditButton = makeButtonComponent("edit-button", "Edit");
const DeleteButton = makeButtonComponent("delete-button", "X");

const SortAlphaButton = makeButtonComponent("wide-button", "Sort alphabetically");
const SortNewButton = makeButtonComponent("wide-button", "Sort by most recently used");
const SortUsedButton = makeButtonComponent("wide-button", "Sort by most used");
const AddCommentButton = makeButtonComponent("wide-button", "Add Comment");
const FinishButton = makeButtonComponent("bottom-button wide-button", "Done!");
const ResetButton = makeButtonComponent("bottom-button wide-button", "Delete ALL Comments");

class SelectorButton extends React.Component {
  render() {
    return React.createElement(
      "button",
      {className: this.props.active ? "active" : "inactive", onMouseUp: this.props.onClickFunction, id: "button-" + this.props.index},
      this.props.index + 1
    );
  }
}