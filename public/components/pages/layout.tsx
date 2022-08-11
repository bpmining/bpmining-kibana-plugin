import React, { useEffect } from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootReducer } from '../../reducer/root_reducer';
import '../_base.scss';
import { PanelComponent } from './side_panel/panel';
import { LayerPanel } from './layer_panel/layer_panel';
import { VisGraphComponent } from './process_graph/vis_graph';
import { VisNode, VisEdge } from '../../../model/vis_types';
import { ServerRequestData } from '../app';
import { BadgeComponent } from '../lib/badge';

import * as fetchCaseGraphActions from '../../reducer_actions/fetch_case_specific_graph';
import * as fetchAggregatedGraphActions from '../../reducer_actions/fetch_aggregated_graph';
import * as badgeActions from '../../reducer_actions/badges';
import * as filterActions from '../../reducer_actions/get_cycle_times';

interface LayoutState {
  rootReducer: RootReducer;
}

type LayoutProps = {
  serverRequestData: ServerRequestData;
  rootReducer: RootReducer;
  fetchCaseGraphAction: Function;
  fetchAggregatedGraphAction: Function;
  unselectCaseAction: Function;
  addBadge: Function;
  unselectCycleTimeAction: Function;
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
    props.rootReducer.filter.selectedCycleTimeCases,
  ]);

  let graphBool = false;
  let nodes: VisNode[] = [];
  let edges: VisEdge[] = [];

  const badges = props.rootReducer.filter.badges;
  const layer = props.rootReducer.layer.selectedLayer;

  if (props.rootReducer.graph.graph !== undefined) {
    graphBool = true;
    nodes = JSON.parse(JSON.stringify(props.rootReducer.graph.graph.nodes));
    edges = JSON.parse(JSON.stringify(props.rootReducer.graph.graph.edges));
  }

  if (props.rootReducer.graph.drillDownGraph) {
    graphBool = true;
    nodes = JSON.parse(JSON.stringify(props.rootReducer.graph.drillDownGraph.nodes));
    edges = JSON.parse(JSON.stringify(props.rootReducer.graph.drillDownGraph.edges));
  }

  const fetchGraph = async () => {
    const drillDown = props.rootReducer.graph.drillDownGraph;
    if (drillDown) {
      return;
    }

    const selectedCase = props.rootReducer.case.selectedCase;
    const selectedCycleTimeCases = props.rootReducer.filter.selectedCycleTimeCases;

    if (selectedCycleTimeCases.id) {
      const { addBadge } = props;

      graphBool = true;
      nodes = selectedCycleTimeCases.graph?.nodes;
      edges = selectedCycleTimeCases.graph?.edges;

      const action = 'Filter Cycle Time Group';
      const id = selectedCycleTimeCases.id;
      const newBadge = {
        filterAction: `${action} ${id}`,
        layer: layer,
      };

      if (badges.filter((badge) => badge.filterAction.includes(action)).length === 0) {
        addBadge(badges, newBadge);
      }
    }

    if (selectedCase !== null) {
      const { fetchCaseGraphAction, addBadge } = props;
      fetchCaseGraphAction(props.serverRequestData, selectedCase, layer);

      const action = 'Filter Case';
      const newBadge = {
        filterAction: `${action} ${selectedCase}`,
        layer: layer,
      };

      if (badges.filter((badge) => badge.filterAction.includes(action)).length === 0) {
        addBadge(badges, newBadge);
      }
    } else {
      const { fetchAggregatedGraphAction } = props;
      fetchAggregatedGraphAction(props.serverRequestData, layer);
    }
  };

  return (
    <div className="main-container">
      <div className="panel-container">
        <PanelComponent
          caseCount={props.rootReducer.graph.caseCount}
          caseIds={props.rootReducer.graph.caseIds}
          serverRequestData={props.serverRequestData}
        />
      </div>

      <div className="canvas">
        <div className="main-design-scope">
          <div className="badge-container">
            {badges.length > 0 &&
              badges.map((badge) => {
                return <BadgeComponent filterAction={badge.filterAction} layer={badge.layer} />;
              })}
          </div>
          {graphBool && <VisGraphComponent nodes={nodes} edges={edges} />}
          <div className="layer-container">
            <LayerPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      fetchCaseGraphAction: fetchCaseGraphActions.fetchCaseGraph,
      fetchAggregatedGraphAction: fetchAggregatedGraphActions.fetchAggregatedGraph,
      unselectCaseAction: fetchCaseGraphActions.unselectCaseAction,
      unselectCycleTimeAction: filterActions.unselectCaseAction,
      addBadge: badgeActions.addBadgeAction,
    },
    dispatch
  );
};

const connectedLayoutComponent = connect(mapStateToProps, mapDispatchToProps)(LayoutComponent);
export { connectedLayoutComponent as LayoutComponent };
