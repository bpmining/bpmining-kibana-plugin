import { VisGraph } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { AnyAction, Dispatch } from 'redux';

export const SHOW_NODE_DETAIL_PANEL = 'SHOW_NODE_DETAIL_PANEL';
export const HIDE_NODE_DETAIL_PANEL = 'HIDE_NODE_DETAIL_PANEL';
export const DISPLAY_DRILL_DOWN_GRAPH = 'DISPLAY_DRILL_DOWN_GRAPH';
export const HIDE_DRILL_DOWN_GRAPH = 'HIDE_DRILL_DOWN_GRAPH';

export function showNodeDetailPanelAction() {
  return {
    type: SHOW_NODE_DETAIL_PANEL,
  };
}

export function hideNodeDetailPanelAction() {
  return {
    type: HIDE_NODE_DETAIL_PANEL,
  };
}

export function displayGraphAction(graph: VisGraph) {
  return {
    type: DISPLAY_DRILL_DOWN_GRAPH,
    graph: graph,
  };
}

export function hideGraphAction() {
  return {
    type: HIDE_DRILL_DOWN_GRAPH,
  };
}

export function displayGraph(graph: VisGraph) {
  return function (dispatch: Dispatch<AnyAction>) {
    const action = displayGraphAction(graph);
    dispatch(action);
  };
}
