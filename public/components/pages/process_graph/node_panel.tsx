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

  function handleDrillDown(event: any) {
    const { hideNodeDetailPanel } = props;
    hideNodeDetailPanel();
  }

  return (
    <EuiPanel className="node-panel">
      <p>{title}</p>
      <br />
      <p>Case Id: {node.caseID}</p>
      <EuiButton onClick={handleDrillDown}>Drill Down</EuiButton>
    </EuiPanel>
  );
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
