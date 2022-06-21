import { VisGraph } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import * as fetchCaseGraphActions from '../reducer_actions/fetch_case_specific_graph';
import * as layerActions from '../reducer_actions/set_layer';

export interface RootReducer {
  graph: VisGraph;
  layer: number;
  error: Error | null;
}

const initialState = {
  graph: undefined,
  layer: 1,
};

export function rootReducer(state = initialState, action: any): RootReducer | any {
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
