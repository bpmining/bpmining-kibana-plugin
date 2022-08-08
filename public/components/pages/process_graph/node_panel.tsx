import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { RootReducer } from 'plugins/bpmining-kibana-plugin/public/reducer/root_reducer';
import './node_panel.scss';
import { Button, Paper } from '@mui/material';
import { COLOR_LAYER_1 } from '../../../../common/colors';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';

import * as nodeDetailPanelActions from '../../../reducer_actions/node_detail_panel';
import * as layerActions from '../../../reducer_actions/set_layer';

export interface NodePanelState {
  rootReducer: RootReducer;
}

export interface NodePanelProps {
  node: VisNode;
  aggregated: boolean;
  rootReducer: RootReducer;
  showNodeDetailPanel: Function;
  hideNodeDetailPanel: Function;
  displayGraph: Function;
  setLayer: Function;
}

const mapStateToProps = (state: NodePanelState) => {
  return state;
};

const NodePanel = (props: NodePanelProps) => {
  const node = props.node;

  const splitLabel = node.label.split('|');
  const title = splitLabel[0];
  const throughputTime = splitLabel[1];

  const frequencyAndThroughputTime = splitLabel[1];
  const frequency = frequencyAndThroughputTime.split('/')[0];
  const meanThroughputTime = frequencyAndThroughputTime.split('/')[1];

  const drillDown = node.thirdPartyData ? true : false;
  async function handleDrillDown(node: VisNode) {
    const { displayGraph, setLayer, hideNodeDetailPanel } = props;
    hideNodeDetailPanel();
    setLayer(2);
    const graph = JSON.parse(JSON.stringify(node.drillDownGraph));
    displayGraph(graph);
  }

  let panel;
  if (props.aggregated) {
    let minThroughputTime = node.minThroughputTime;
    let maxThroughputTime = node.maxThroughputTime;
    if (minThroughputTime === '0 s' && maxThroughputTime === '0 s') {
      minThroughputTime = '-';
      maxThroughputTime = '-';
    }

    panel = (
      <Paper className="node-panel" elevation={2}>
        <p>{title}</p>
        <br />
        <div className="node-panel-item">
          <b>Absolute Frequency:</b> {frequency}
        </div>
        <div className="node-panel-item">
          <b>Total Duration:</b> {node.totalThroughputTime}
        </div>
        <div className="node-panel-item">
          <b>Mean Duration:</b> {meanThroughputTime}
        </div>
        <div className="node-panel-item">
          <b>Min. Duration:</b> {minThroughputTime}
        </div>
        <div className="node-panel-item">
          <b>Max. Duration:</b> {maxThroughputTime}
        </div>
        <br />
        <div className="centered-button">
          {drillDown && (
            <Button
              style={{
                backgroundColor: COLOR_LAYER_1,
                color: 'white',
                textTransform: 'none',
                fontSize: '12pt',
              }}
              onClick={() => handleDrillDown(props.node)}
            >
              Drill Down
            </Button>
          )}
        </div>
      </Paper>
    );
  } else {
    panel = (
      <Paper className="node-panel">
        <p>{title}</p>
        <br />
        <div className="node-panel-item">
          <b>Case Id:</b> {node.caseID}
        </div>
        <div className="node-panel-item">
          <b>Case Frequency:</b> {node.frequency}
        </div>
        <div className="node-panel-item">
          <b>Throughput Time:</b> {throughputTime}
        </div>
        <br />
        <div>
          {node.contextInfo &&
            Object.keys(node.contextInfo).map((key) => {
              return (
                <div className="node-panel-item">
                  <b>{key}:</b> {node.contextInfo[key]}
                </div>
              );
            })}
        </div>
        <br />
        <div className="centered-button">
          {drillDown && (
            <Button
              style={{
                backgroundColor: COLOR_LAYER_1,
                color: 'white',
                textTransform: 'none',
                fontSize: '12pt',
              }}
              onClick={() => handleDrillDown(props.node)}
            >
              Drill Down
            </Button>
          )}
        </div>
      </Paper>
    );
  }
  return panel;
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      showNodeDetailPanel: nodeDetailPanelActions.showNodeDetailPanelAction,
      hideNodeDetailPanel: nodeDetailPanelActions.hideNodeDetailPanelAction,
      displayGraph: nodeDetailPanelActions.displayGraph,
      setLayer: layerActions.setLayer,
    },
    dispatch
  );
};

const connectedNodePanel = connect(mapStateToProps, mapDispatchToProps)(NodePanel);
export { connectedNodePanel as NodePanel };
