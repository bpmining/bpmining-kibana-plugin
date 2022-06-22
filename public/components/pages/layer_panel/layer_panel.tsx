import React from 'react';
import './layers.scss';
import { EuiPanel } from '@elastic/eui';
import { RootReducer } from '../../../reducer/root_reducer';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import * as layerActions from '../../../reducer_actions/set_layer';

interface LayerPanelState {
  rootReducer: RootReducer;
}

interface LayerPanelProps {
  setLayerAction: Function;
}

const mapStateToProps = (state: LayerPanelState) => {
  return state;
};

export function LayerPanelComponent(props: LayerPanelProps) {
  const changeLayer = (layer: number) => {
    const { setLayerAction } = props;
    setLayerAction(layer);
  };
  return (
    <EuiPanel className="layer-panel" paddingSize="m">
      <p>Layers</p>
      <br></br>
      <div className="layer-stack">
        <div className="layer-1" onClick={() => changeLayer(1)}></div>
        <div className="layer-2" onClick={() => changeLayer(2)}></div>
      </div>
    </EuiPanel>
  );
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      setLayerAction: layerActions.setLayer,
    },
    dispatch
  );
};

const connectedLayerPanel = connect(mapStateToProps, mapDispatchToProps)(LayerPanelComponent);
export { connectedLayerPanel as LayerPanel };
