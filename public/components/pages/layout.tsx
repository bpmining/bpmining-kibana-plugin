import React, { useEffect } from 'react';
import { EuiPage, EuiResizableContainer } from '@elastic/eui';
import { PanelComponent } from './side_panel/panel';
import { LayerPanel } from './layer_panel/layer_panel';
import '../_base.scss';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootReducer } from '../../reducer/root_reducer';
import { VisGraphComponent } from './process_graph/vis_graph';
import { calculateColorValue } from '../../services';
import { VisNode, VisEdge } from '../../../model/vis_types';
import * as fetchCaseGraphActions from '../../reducer_actions/fetch_case_specific_graph';
import * as fetcAggregatedGraphActions from '../../reducer_actions/fetch_aggregated_graph';
import { ServerRequestData } from '../app';

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
  ]);

  let graphBool = false;
  let nodes: VisNode[] = [];
  let edges: VisEdge[] = [];

  if (props.rootReducer.graph.graph !== undefined) {
    graphBool = true;
    nodes = props.rootReducer.graph.graph.nodes;
    edges = props.rootReducer.graph.graph.edges;
  }

  const fetchGraph = () => {
    const layer = props.rootReducer.layer.selectedLayer;

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

            <EuiResizablePanel mode="main" initialSize={80} minSize="500px">
              <div className="design-scope">
                {graphBool && (
                  <VisGraphComponent
                    nodes={nodes}
                    edges={edges}
                    color={calculateColorValue(props.rootReducer.layer.selectedLayer)}
                  />
                )}
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
