function addComment(newComment) {
  return {
    type: "ADD",
    comment: newComment
  };
}

function setComment(commentIndex, newComment) {
  return {
    type: "SET",
    index: commentIndex,
    comment: newComment
  };
}

function setComments(newComments) {
  return {
    type: "LOAD",
    comments: newComments
  };
}

function deleteComment(commentIndex) {
  return {
    type: "DELETE",
    index: commentIndex
  };
}

function deleteAll() {
  return {
    type: "RESET"
  };
}

function sort(method) {
  return {
    type: "SORT",
    by: method
  };
}

function select(selectedIndex) {
  return {
    type: "SELECT",
    index: selectedIndex
  };
}