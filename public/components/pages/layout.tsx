import React, { useEffect, useState } from 'react';
import { EuiPage, EuiResizableContainer } from '@elastic/eui';
import { PanelComponent } from './side_panel/panel';
import { LayerPanel } from './layer_panel/layer_panel';
import '../_base.scss';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { VisGraphComponent } from './process_graph/vis_graph';
import { VisNode, VisEdge } from '../../../model/vis_types';
import * as fetchCaseGraphActions from '../../reducer_actions/fetch_case_specific_graph';
import * as fetcAggregatedGraphActions from '../../reducer_actions/fetch_aggregated_graph';
import { ServerRequestData } from '../app';
import { RootReducer } from '../../reducer/root_reducer';

interface LayoutState {
  rootReducer: RootReducer;
}

type LayoutProps = {
  serverRequestData: ServerRequestData;
  rootReducer: RootReducer;
  fetchCaseGraphAction: Function;
  fetchAggregatedGraphAction: Function;
};

const mapStateToProps = (state: LayoutState) => {
  return state;
};

const LayoutComponent = (props: LayoutProps) => {
  useEffect(() => {
    fetchGraph();
  }, [
    props.rootReducer.case.selectedCase,
    props.rootReducer.layer.selectedLayer,
    props.serverRequestData,
    props.rootReducer.graph.drillDownGraph,
  ]);

  let graphBool = false;
  let nodes: VisNode[] = [];
  let edges: VisEdge[] = [];

  if (props.rootReducer.graph.graph !== undefined) {
    graphBool = true;
    nodes = props.rootReducer.graph.graph.nodes;
    edges = props.rootReducer.graph.graph.edges;
  }

  if (props.rootReducer.graph.drillDownGraph) {
    graphBool = true;
    nodes = props.rootReducer.graph.drillDownGraph.nodes;
    edges = props.rootReducer.graph.drillDownGraph.edges;
  }

  const fetchGraph = async () => {
    const layer = props.rootReducer.layer.selectedLayer;
    const drillDown = props.rootReducer.graph.drillDownGraph;
    if (drillDown) {
      return;
    }
    // check filters
    const selectedCase = props.rootReducer.case.selectedCase;
    if (selectedCase !== null) {
      const { fetchCaseGraphAction } = props;
      fetchCaseGraphAction(props.serverRequestData, selectedCase, layer);
    } else {
      // no filters applied
      const { fetchAggregatedGraphAction } = props;
      fetchAggregatedGraphAction(props.serverRequestData, layer);
    }
  };
  console.log(nodes);
  return (
    <EuiPage paddingSize="none">
      <EuiResizableContainer style={{ height: 650, width: '100%' }}>
        {(EuiResizablePanel, EuiResizableButton) => (
          <>
            <EuiResizablePanel mode="collapsible" initialSize={20} minSize="18%">
              <PanelComponent
                caseCount={props.rootReducer.graph.caseCount}
                caseIds={props.rootReducer.graph.caseIds}
                serverRequestData={props.serverRequestData}
              />
            </EuiResizablePanel>

            <EuiResizableButton />

            <EuiResizablePanel className="canvas" mode="main" initialSize={80} minSize="500px">
              <div className="design-scope">
                {graphBool && <VisGraphComponent nodes={nodes} edges={edges} />}
                <div className="layer-container">
                  <LayerPanel />
                </div>
              </div>
            </EuiResizablePanel>
          </>
        )}
      </EuiResizableContainer>
    </EuiPage>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      fetchCaseGraphAction: fetchCaseGraphActions.fetchCaseGraph,
      fetchAggregatedGraphAction: fetcAggregatedGraphActions.fetchAggregatedGraph,
    },
    dispatch
  );
};

const connectedLayoutComponent = connect(mapStateToProps, mapDispatchToProps)(LayoutComponent);
export { connectedLayoutComponent as LayoutComponent };
