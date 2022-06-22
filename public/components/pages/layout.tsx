import React, { useEffect, useState } from 'react';
import { EuiPage, EuiResizableContainer } from '@elastic/eui';
import { PanelComponent } from './side_panel/panel';
import { LayerPanel } from './layer_panel/layer_panel';
import '../_base.scss';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootReducer } from '../../reducer/root_reducer';
import { VisGraphComponent } from './process_graph/vis_graph';
import { calculateColorValue } from '../../services';

import * as fetchCaseGraphActions from '../../reducer_actions/fetch_case_specific_graph';
import * as fetcAggregatedGraphActions from '../../reducer_actions/fetch_aggregated_graph';

interface LayoutState {
  rootReducer: RootReducer;
}

type LayoutProps = {
  metadata: any;
  rootReducer: RootReducer;
  fetchCaseGraphAction: Function;
  fetchAggregatedGraphAction: Function;
};

const mapStateToProps = (state: LayoutState) => {
  console.log(state);
  return state;
};

const LayoutComponent = (props: LayoutProps) => {
  useEffect(() => {
    fetchGraph();
  }, [props.rootReducer.selectedCase, props.rootReducer.layer]);

  let graphBool = false;
  if (props.rootReducer.graph) {
    graphBool = true;
  }

  const fetchGraph = () => {
    const layer = props.rootReducer.layer;

    // check filters
    const selectedCase = props.rootReducer.selectedCase;
    if (selectedCase !== null) {
      const { fetchCaseGraphAction } = props;
      fetchCaseGraphAction(props.metadata, selectedCase, layer);
    } else {
      // no filters applied
      const { fetchAggregatedGraphAction } = props;
      fetchAggregatedGraphAction(props.metadata, layer);
    }
  };

  return (
    <EuiPage paddingSize="none">
      <EuiResizableContainer style={{ height: 650, width: '100%' }}>
        {(EuiResizablePanel, EuiResizableButton) => (
          <>
            <EuiResizablePanel mode="collapsible" initialSize={20} minSize="18%">
              <PanelComponent
                caseCount={props.rootReducer.caseCount}
                caseIds={props.rootReducer.caseIds}
                metadata={props.metadata}
              />
            </EuiResizablePanel>

            <EuiResizableButton />

            <EuiResizablePanel mode="main" initialSize={80} minSize="500px">
              <div className="design-scope">
                {graphBool && (
                  <VisGraphComponent
                    nodes={props.rootReducer.graph.nodes}
                    edges={props.rootReducer.graph.edges}
                    color={calculateColorValue(props.rootReducer.layer)}
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
