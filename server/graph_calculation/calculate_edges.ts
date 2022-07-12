import { RawVisEdge, VisNodeNeighbours } from './build_aggregated_graph';
import { calculateEdgeThroughputTime } from './calculate_throughput_time';

export function calculateCaseGraphEdges(aggregatedNodes: VisNodeNeighbours[]) {
  let edges: RawVisEdge[] = [];

  aggregatedNodes.forEach((node: VisNodeNeighbours) => {
    if (node.next === undefined || node.prev === undefined) {
      return;
    }
    const edgeToNext = {
      from: node.node.id,
      to: node.next.id,
      label: calculateEdgeThroughputTime(node.node, node.next),
    };
    edges.push(edgeToNext);

    const edgeToPrevious = {
      from: node.prev.id,
      to: node.node.id,
      label: calculateEdgeThroughputTime(node.prev, node.node),
    };
    edges.push(edgeToPrevious);
  });

  const uniqueEdges = edges.filter(
    (edge, index, self) => index === self.findIndex((i) => i.from === edge.from && i.to === edge.to)
  );
  return uniqueEdges;
}

export function calculateAggregatedGraphEdges(aggregatedNodes: VisNodeNeighbours[]) {
  let edges: RawVisEdge[] = [];

  aggregatedNodes.forEach((node: VisNodeNeighbours) => {
    if (node.next === undefined || node.prev === undefined) {
      return;
    }
    const edgeToNext = {
      from: node.node.id,
      to: node.next.id,
      label: calculateEdgeThroughputTime(node.node, node.next),
    };
    edges.push(edgeToNext);

    const edgeToPrevious = {
      from: node.prev.id,
      to: node.node.id,
      label: calculateEdgeThroughputTime(node.prev, node.node),
    };
    edges.push(edgeToPrevious);
  });

  const uniqueEdges = edges.filter(
    (edge, index, self) => index === self.findIndex((i) => i.from === edge.from && i.to === edge.to)
  );
  return uniqueEdges;
}
