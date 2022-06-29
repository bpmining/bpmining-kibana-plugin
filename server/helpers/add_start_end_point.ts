import { VisNodeNeighbours } from '../graph_calculation/build_aggregated_graph';

export function addStartAndEndPoint(nodes: VisNodeNeighbours[]) {
  const startNode = {
    node: { label: 'S', id: 0 },
    prev: { label: undefined, id: undefined },
    next: { label: undefined, id: undefined },
  };
  const endNode = {
    node: { label: 'E', id: nodes.length + 1 },
    prev: { label: undefined, id: undefined },
    next: { label: undefined, id: undefined },
  };
  nodes.push(startNode, endNode);
  nodes.forEach((node) => {
    if (node.node.id === startNode.node.id || node.node.id === endNode.node.id) {
      return;
    }
    if (node.prev.id === undefined) {
      node.prev = startNode.node;
      startNode.next = node.node;
    }
    if (node.next.id === undefined) {
      node.next = endNode.node;
      endNode.prev = node.node;
    }
  });

  return nodes;
}
