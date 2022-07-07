import * as fetchCaseGraphActions from '../reducer_actions/fetch_case_specific_graph';

export interface CaseReducer {
  selectedCase: string | null;
}

const initialState = {
  selectedCase: null,
};

export const caseReducer = (state = initialState, action: any): CaseReducer => {
  switch (action.type) {
    case fetchCaseGraphActions.SELECT_CASE:
      return {
        ...state,
        selectedCase: action.selectedCase,
      };
    case fetchCaseGraphActions.UNSELECT_CASE:
      return {
        ...state,
        selectedCase: null,
      };
    default:
      return state;
  }
};
