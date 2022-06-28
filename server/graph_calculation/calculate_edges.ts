import { VisNode, VisEdge } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export function calculateEdges(visNodes: VisNode[]) {
  let edges: VisEdge[] = [];

  for (let i = 0; i < visNodes.length; i++) {
    if (i === 0) {
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
