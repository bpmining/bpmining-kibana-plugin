import * as filterActions from '../reducer_actions/get_cycle_times';
import { CycleTimeGroup } from '../reducer_actions/get_cycle_times';

export interface FilterReducer {
  cycleTimeGroups: CycleTimeGroup[];
  error: Error | null;
}

const initialState = {
  cycleTimeGroups: [],
  error: null,
};

export const filterReducer = (state = initialState, action: any): FilterReducer => {
  switch (action.type) {
    case filterActions.GET_CYCLE_TIME_DATA_SUCCESS:
      return {
        ...state,
        cycleTimeGroups: action.cycleTimeGroups,
      };
    case filterActions.GET_CYCLE_TIME_DATA_ERROR:
      return {
        ...state,
        cycleTimeGroups: [],
        error: action.error,
      };
    default:
      return state;
  }
};
