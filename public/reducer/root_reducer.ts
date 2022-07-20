import { combineReducers } from 'redux';
import { caseReducer, CaseReducer } from './case_reducer';
import { FilterReducer, filterReducer } from './filter_reducer';
import { GraphReducer, graphReducer } from './graph_reducer';
import { layerReducer, LayerReducer } from './layer_reducer';

export interface RootReducer {
  graph: GraphReducer;
  case: CaseReducer;
  layer: LayerReducer;
  filter: FilterReducer;
}

export const rootReducer = combineReducers({
  graph: graphReducer,
  case: caseReducer,
  layer: layerReducer,
  filter: filterReducer,
});
