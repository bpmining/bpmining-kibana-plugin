import React, { useState } from 'react';
import './layers.scss';
import { RootReducer } from '../../../reducer/root_reducer';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import LayersIcon from '@mui/icons-material/Layers';
import { Paper } from '@mui/material';

import * as layerActions from '../../../reducer_actions/set_layer';
import * as nodeDetailPanelActions from '../../../reducer_actions/node_detail_panel';

interface LayerPanelState {
  rootReducer: RootReducer;
}

interface LayerPanelProps {
  setLayerAction: Function;
  hideDrillDownGraph: Function;
  hideNodeDetailPanel: Function;
}

const mapStateToProps = (state: LayerPanelState) => {
  return state;
};

export function LayerPanelComponent(props: LayerPanelProps) {
  const [currentLayer, setCurrentLayer] = useState<number>(1);

  const changeLayer = (layer: number) => {
    const { setLayerAction, hideDrillDownGraph, hideNodeDetailPanel } = props;
    setCurrentLayer(layer);
    hideDrillDownGraph();
    hideNodeDetailPanel();
    setLayerAction(layer);
  };

  let layer1Component = <div className="layer-1-selected" onClick={() => changeLayer(1)}></div>;
  let layer2Component = (
    <div className="layer-2" onClick={() => changeLayer(2)}>
      {' '}
    </div>
  );

  if (currentLayer === 2) {
    layer1Component = <div className="layer-1" onClick={() => changeLayer(1)}></div>;
    layer2Component = <div className="layer-2-selected" onClick={() => changeLayer(2)}></div>;
  }

  return (
    <Paper className="layer-panel" elevation={2}>
      <div className="headline-container">
        <p> Layers </p>
        <LayersIcon />
      </div>
      <br></br>
      <div className="layer-stack">
        {layer1Component}
        {layer2Component}
      </div>
    </Paper>
  );
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      setLayerAction: layerActions.setLayer,
      hideDrillDownGraph: nodeDetailPanelActions.hideGraphAction,
      hideNodeDetailPanel: nodeDetailPanelActions.hideNodeDetailPanelAction,
    },
    dispatch
  );
};

const connectedLayerPanel = connect(mapStateToProps, mapDispatchToProps)(LayerPanelComponent);
export { connectedLayerPanel as LayerPanel };
