import { EuiButton, EuiPanel } from '@elastic/eui';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { RootReducer } from 'plugins/bpmining-kibana-plugin/public/reducer/root_reducer';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import * as nodeDetailPanelActions from '../../../reducer_actions/node_detail_panel';

export interface NodePanelState {
  rootReducer: RootReducer;
}

export interface NodePanelProps {
  node: VisNode;
  aggregated: boolean;
  rootReducer: RootReducer;
  showNodeDetailPanel: Function;
  hideNodeDetailPanel: Function;
}

const mapStateToProps = (state: NodePanelState) => {
  return state;
};

const NodePanel = (props: NodePanelProps) => {
  const node = props.node;
  const splitLabel = node.label.split('|');
  const title = splitLabel[0];
  console.log(node);
  const frequencyAndThroughputTime = splitLabel[1];
  const frequency = frequencyAndThroughputTime.split('/')[0];
  const throughputTime = frequencyAndThroughputTime.split('/')[1];
  let contextInfo;
  if (node.contextInfo) {
    contextInfo = node.contextInfo.map((line) => line).join('\n');
  }
  const drillDown = node.thirdPartyData ? true : false;

  function handleDrillDown(event: any) {
    const { hideNodeDetailPanel } = props;
    hideNodeDetailPanel();
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
        Mean Duration: {throughputTime}
        <br />
        Min. Duration: {node.minThroughputTime}
        <br />
        Max. Duration: {node.maxThroughputTime}
        <br />
        {drillDown && <EuiButton onClick={handleDrillDown}>Drill Down</EuiButton>}
      </EuiPanel>
    );
  } else {
    panel = (
      <EuiPanel className="node-panel">
        <p>{title}</p>
        <br />
        Case Id: {node.caseID}
        <br />
        <br />
        Absolute Frequency:
        <br />
        Case Frequency: {node.frequency} <br />
        Throughput Time: {throughputTime}
        <br />
        <br />
        {contextInfo} <br></br>
        {drillDown && <EuiButton onClick={handleDrillDown}>Drill Down</EuiButton>}
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
    },
    dispatch
  );
};

const connectedNodePanel = connect(mapStateToProps, mapDispatchToProps)(NodePanel);
export { connectedNodePanel as NodePanel };
