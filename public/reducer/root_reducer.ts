import * as fetchCaseGraphActions from '../reducer_actions/fetch_case_specific_graph';

const initialState = {
  graph: undefined,
};

export function rootReducer(state = initialState, action: any) {
  console.log('action in root reducer: ' + action.type);

  switch (action.type) {
    case fetchCaseGraphActions.FETCH_CASE_GRAPH_SUCCESS:
      return {
        ...state,
        graph: action.graph,
        error: null,
      };
    case fetchCaseGraphActions.FETCH_CASE_GRAPH_ERROR:
      return {
        ...state,
        graph: undefined,
        error: action.error,
      };
    case fetchCaseGraphActions.UNSELECT_CASE:
      return {
        ...state,
        graph: undefined,
        error: null,
      };
    default:
      return state;
  }
}
