import { VisGraph } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import * as fetchCaseGraphActions from '../reducer_actions/fetch_case_specific_graph';
import * as fetchAggregatedGraphActions from '../reducer_actions/fetch_aggregated_graph';

export interface GraphReducer {
  graph: VisGraph | undefined;
  caseIds: string[];
  caseCount: number;
  error: Error | null;
}

const initialState = {
  graph: undefined,
  caseIds: [],
  caseCount: 0,
  error: null,
};

export const graphReducer = (state = initialState, action: any): GraphReducer => {
  console.log('action in root reducer: ' + action.type);

  switch (action.type) {
    case fetchAggregatedGraphActions.FETCH_AGGREGATED_GRAPH_SUCCESS:
      return {
        ...state,
        graph: action.graph,
        caseIds: action.caseIds,
        caseCount: action.caseCount,
        error: null,
      };
    case fetchAggregatedGraphActions.FETCH_AGGREGATED_GRAPH_ERROR:
      return {
        ...state,
        graph: undefined,
        error: action.error,
      };
    case fetchCaseGraphActions.FETCH_CASE_GRAPH_SUCCESS:
      return {
        ...state,
        graph: action.graph,
        caseIds: action.caseIds,
        caseCount: action.caseCount,
        error: null,
      };
    case fetchCaseGraphActions.FETCH_CASE_GRAPH_ERROR:
      return {
        ...state,
        graph: undefined,
        error: action.error,
      };
    default:
      return state;
  }
};
