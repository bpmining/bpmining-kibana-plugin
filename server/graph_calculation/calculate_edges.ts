import { VisEdge } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { VisNodeNeighbours } from './build_aggregated_graph';

export function calculateEdges(aggregatedNodes: VisNodeNeighbours[]) {
  let edges: VisEdge[] = [];

  aggregatedNodes.forEach((node: VisNodeNeighbours) => {
    if (node.next.id === undefined || node.prev.id === undefined) {
      return;
    }
    const edgeToNext = {
      from: node.node.id,
      to: node.next.id,
    };
    edges.push(edgeToNext);

    const edgeToPrevious = {
      from: node.prev.id,
      to: node.node.id,
    };
    edges.push(edgeToPrevious);
  });

  const uniqueEdges = edges.filter(
    (edge, index, self) => index === self.findIndex((i) => i.from === edge.from && i.to === edge.to)
  );
  return uniqueEdges;
}
