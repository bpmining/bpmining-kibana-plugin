import { VisGraph } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export const SHOW_NODE_DETAIL_PANEL = 'SHOW_NODE_DETAIL_PANEL';
export const HIDE_NODE_DETAIL_PANEL = 'HIDE_NODE_DETAIL_PANEL';
export const DISPLAY_GRAPH = 'DISPLAY_GRAPH';

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
    type: DISPLAY_GRAPH,
    graph: graph,
  };
}
