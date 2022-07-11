export const SHOW_NODE_DETAIL_PANEL = 'SHOW_NODE_DETAIL_PANEL';
export const HIDE_NODE_DETAIL_PANEL = 'HIDE_NODE_DETAIL_PANEL';

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
