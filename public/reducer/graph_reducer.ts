import { VisGraph } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import * as fetchCaseGraphActions from '../reducer_actions/fetch_case_specific_graph';
import * as fetchAggregatedGraphActions from '../reducer_actions/fetch_aggregated_graph';
import * as nodeDetailPanelActions from '../reducer_actions/node_detail_panel';

export interface GraphReducer {
  graph: VisGraph | undefined;
  drillDownGraph: VisGraph | undefined;
  caseIds: string[];
  caseCount: number;
  error: Error | null;
  nodeDetail: boolean;
}

const initialState = {
  graph: undefined,
  drillDownGraph: undefined,
  caseIds: [],
  caseCount: 0,
  error: null,
  nodeDetail: false,
};

export const graphReducer = (state = initialState, action: any): GraphReducer => {
  switch (action.type) {
    case fetchAggregatedGraphActions.FETCH_AGGREGATED_GRAPH_SUCCESS:
      return {
        ...state,
        graph: action.graph,
        drillDownGraph: undefined,
        caseIds: action.caseIds,
        caseCount: action.caseCount,
        error: null,
      };
    case fetchAggregatedGraphActions.FETCH_AGGREGATED_GRAPH_ERROR:
      return {
        ...state,
        graph: undefined,
        error: action.error,
      };
    case fetchCaseGraphActions.FETCH_CASE_GRAPH_SUCCESS:
      return {
        ...state,
        graph: action.graph,
        drillDownGraph: undefined,
        caseIds: action.caseIds,
        caseCount: action.caseCount,
        error: null,
      };
    case fetchCaseGraphActions.FETCH_CASE_GRAPH_ERROR:
      return {
        ...state,
        graph: undefined,
        error: action.error,
      };
    case nodeDetailPanelActions.SHOW_NODE_DETAIL_PANEL:
      return {
        ...state,
        nodeDetail: true,
      };
    case nodeDetailPanelActions.HIDE_NODE_DETAIL_PANEL:
      return {
        ...state,
        nodeDetail: false,
      };
    case nodeDetailPanelActions.DISPLAY_GRAPH:
      return {
        ...state,
        nodeDetail: false,
        drillDownGraph: action.graph,
      };
    default:
      return state;
  }
};
