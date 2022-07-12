import { EuiButton, EuiPanel, EuiText } from '@elastic/eui';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { RootReducer } from 'plugins/bpmining-kibana-plugin/public/reducer/root_reducer';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
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
    const { displayGraph, setLayer } = props;
    await setLayer(2);
    await displayGraph(node.thirdPartyData);
  }

  let panel;
  if (props.aggregated) {
    panel = (
      <EuiPanel className="node-panel">
        <p>{title}</p>
        <br />
        Absolute Frequency: {frequency} <br />
        Total Duration: {node.totalThroughputTime}
        <br />
        Mean Duration: {meanThroughputTime}
        <br />
        Min. Duration: {node.minThroughputTime}
        <br />
        Max. Duration: {node.maxThroughputTime}
        <br />
        {drillDown && <EuiButton onClick={() => handleDrillDown(props.node)}>Drill Down</EuiButton>}
      </EuiPanel>
    );
  } else {
    panel = (
      <EuiPanel className="node-panel">
        <p>{title}</p>
        <br />
        Case Id: {node.caseID}
        <br />
        Case Frequency: {node.frequency} <br />
        Throughput Time: {throughputTime}
        <br />
        <br />
        <EuiText>{node.contextInfo} </EuiText>
        <br></br>
        {drillDown && <EuiButton onClick={() => handleDrillDown(props.node)}>Drill Down</EuiButton>}
      </EuiPanel>
    );
  }

  return panel;
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      showNodeDetailPanel: nodeDetailPanelActions.showNodeDetailPanelAction,
      hideNodeDetailPanel: nodeDetailPanelActions.hideNodeDetailPanelAction,
      displayGraph: nodeDetailPanelActions.displayGraphAction,
      setLayer: layerActions.setLayer,
    },
    dispatch
  );
};

const connectedNodePanel = connect(mapStateToProps, mapDispatchToProps)(NodePanel);
export { connectedNodePanel as NodePanel };
