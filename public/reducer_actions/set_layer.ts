import { AnyAction, Dispatch } from 'redux';

export const SET_LAYER_SUCCESS = 'SET_LAYER_SUCCESS';

export function setLayerSuccessAction(layer: number) {
  return {
    type: SET_LAYER_SUCCESS,
    layer: layer,
  };
}

export const setLayer = (layer: number) => {
  return function (dispatch: Dispatch<AnyAction>) {
    const action = setLayerSuccessAction(layer);
    dispatch(action);
  };
};
