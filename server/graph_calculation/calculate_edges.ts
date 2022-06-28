import { VisNode, VisEdge } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export function calculateEdges(visNodes: VisNode[]) {
  let edges: VisEdge[] = [];

  for (let i = 1; i <= visNodes.length + 1; i++) {
    if (i === 1) {
      continue;
    }
    const edge = {
      from: visNodes[i - 1].id,
      to: visNodes[i].id,
    };
    edges.push(edge);
  }

  return edges;
}
