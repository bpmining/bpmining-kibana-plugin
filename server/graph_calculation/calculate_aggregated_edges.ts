import { VisNode, VisEdge } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export function calculateAggregatedEdges(aggregatedNodes: any) {
  let edges: VisEdge[] = [];

  aggregatedNodes.forEach((node) => {
    if (node.next.id === undefined || node.prev.id === undefined) {
      return;
    }
    const edgeToNext = {
      from: node.node.id,
      to: node.next.id,
    };
    edges.push(edgeToNext);
    if (node.prev === undefined) {
      return;
    }
    const edgeToPrevious = {
      from: node.prev.id,
      to: node.node.id,
    };
    edges.push(edgeToPrevious);
  });
  console.log(edges);
  const uniqueEdges = edges.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.from === value.from && t.to === value.to)
  );

  return uniqueEdges;
}
