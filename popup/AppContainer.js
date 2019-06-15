const mapStateToProps = state => {
  return {
    comments: state.comments,
    loaded: state.loaded,
    editing: state.editing == -2 ? state.comments.length - 1 : state.editing
  };
}

const mapDispatchToProps = dispatch => {
  return {
    sortAlpha: () => {dispatch(sort("ALPHA"));},
    sortNew: () => {dispatch(sort("NEW"));},
    sortUsed: () => {dispatch(sort("USED"));},
    add: () => {dispatch(addComment(new Comment("")));},
    set: (index, comment) => {dispatch(setComment(index, comment));},
    load: (comments) => {dispatch(setComments(comments));},
    delete: (index) => {dispatch(deleteComment(index))},
    reset: () => {dispatch(deleteAll())},
    select: (index) => {dispatch(select(index));}
  };
}

const AppContainer = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AppPresenter);