import * as layerActions from '../reducer_actions/set_layer';

export interface LayerReducer {
  selectedLayer: number;
}

const initialState = {
  selectedLayer: 1,
};

export const layerReducer = (state = initialState, action: any): LayerReducer => {
  switch (action.type) {
    case layerActions.SET_LAYER_SUCCESS:
      return {
        ...state,
        selectedLayer: action.layer,
      };
    default:
      return state;
  }
};
