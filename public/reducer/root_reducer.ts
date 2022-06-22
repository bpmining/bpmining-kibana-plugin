import { VisGraph } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import * as fetchCaseGraphActions from '../reducer_actions/fetch_case_specific_graph';
import * as fetchAggregatedGraphActions from '../reducer_actions/fetch_aggregated_graph';
import * as layerActions from '../reducer_actions/set_layer';

export interface RootReducer {
  graph: VisGraph;
  layer: number;
  selectedCase: string;
  caseIds: string[];
  caseCount: number;
  error: Error | null;
}

const initialState = {
  graph: undefined,
  selectedCase: null,
  caseIds: [],
  caseCount: 0,
  layer: 1,
};

export function rootReducer(state = initialState, action: any): RootReducer | any {
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
    case fetchCaseGraphActions.SELECT_CASE:
      return {
        ...state,
        selectedCase: action.selectedCase,
        error: null,
      };
    case fetchCaseGraphActions.UNSELECT_CASE:
      return {
        ...state,
        selectedCase: null,
        error: null,
      };
    case layerActions.SET_LAYER_SUCCESS:
      return {
        ...state,
        layer: action.layer,
        error: null,
      };
    default:
      return state;
  }
}
