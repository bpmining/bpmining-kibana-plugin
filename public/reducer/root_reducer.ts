import { combineReducers } from 'redux';
import { caseReducer, CaseReducer } from './case_reducer';
import { GraphReducer, graphReducer } from './graph_reducer';
import { LayerReducer, layerReducer } from './layer_reducer';

export interface RootReducer {
  graph: GraphReducer;
  case: CaseReducer;
  layer: LayerReducer;
}

export const rootReducer = combineReducers({
  graph: graphReducer,
  case: caseReducer,
  layer: layerReducer,
});
