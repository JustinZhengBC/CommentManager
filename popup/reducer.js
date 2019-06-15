function compareAlpha(first, second) {
  if (first.texts[0] === second.texts[0]) {
    return 0;
  } else if (first.texts[0] < second.texts[0]) {
    return -1;
  } else {
    return 1;
  }
}

function compareNew(first, second) {
  return second.timeLastUsed - first.timeLastUsed;
}

function compareUsed(first, second) {
  return second.timesUsed - first.timesUsed;
}

function comments(state = [], action) {
  switch(action.type) {
    case "ADD":
      return state.concat([action.comment]);
    case "SET":
      let newState = [...state];
      newState[action.index] = action.comment;
      return newState;
    case "LOAD":
      if (action.comments) {
        return action.comments;
      } else {
        return [...state];
      }
    case "DELETE":
      let stateWithoutComment = [...state];
      stateWithoutComment.splice(action.index, 1);
      return stateWithoutComment;
    case "RESET":
      return [];
    case "SORT":
      let sortedState = [...state];
      if (action.by == "NEW") {
        sortedState.sort(compareNew);
      } else if (action.by == "USED") {
        sortedState.sort(comparedUsed);
      } else {
        sortedState.sort(compareAlpha);
      }
      return sortedState;
    default:
      return state;
  };
}

function loaded(state = false, action) {
  return state || action.type == "LOAD";
}

function editing(state = -1, action) {
  if (action.type == "SELECT") {
    return action.index;
  } else if (action.type == "ADD") {
    return -2; // mapStateToProps will interpret this as the index of the added comment
  } else {
    return -1;
  }
}

const appReducer = Redux.combineReducers({comments, loaded, editing});