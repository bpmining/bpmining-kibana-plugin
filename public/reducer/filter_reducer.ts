import * as filterActions from '../reducer_actions/get_cycle_times';
import * as badgeActions from '../reducer_actions/badges';
import { BadgeItem } from '../components/lib/badge';
import { CycleTimeGroupItem } from 'plugins/bpmining-kibana-plugin/server/filter_calculation/calculate_cycle_time_buckets';

export interface FilterReducer {
  cycleTimeGroups: CycleTimeGroupItem[];
  selectedCycleTimeCases: any;
  badges: BadgeItem[];
  error: Error | null;
}

const initialState = {
  cycleTimeGroups: [],
  selectedCycleTimeCases: [],
  badges: [],
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
    case filterActions.SELECT_CYCLE_TIME_CASES:
      return {
        ...state,
        selectedCycleTimeCases: action.selectedCycleTimeCases,
      };
    case filterActions.UNSELECT_CYCLE_TIME_CASES:
      return {
        ...state,
        selectedCycleTimeCases: [],
      };
    case badgeActions.ADD_BADGE:
      return {
        ...state,
        badges: action.newBadges,
      };
    case badgeActions.REMOVE_BADGE:
      return {
        ...state,
        badges: action.updatedBadges,
      };
    default:
      return state;
  }
};
