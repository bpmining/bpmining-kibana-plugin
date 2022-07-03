import { VisNodeNeighbours } from '../graph_calculation/build_aggregated_graph';

export function addStartAndEndPoint(nodes: VisNodeNeighbours[], lastIndex: number) {
  const startNode = {
    node: { label: 'S', id: 0 },
    prev: undefined,
    next: undefined,
  };
  const endNode = {
    node: { label: 'E', id: lastIndex + 1 },
    prev: undefined,
    next: undefined,
  };

  nodes.push(startNode, endNode);

  nodes.forEach((currentNode) => {
    if (currentNode.node.id === startNode.node.id || currentNode.node.id === endNode.node.id) {
      return;
    }
    if (currentNode.prev === undefined) {
      currentNode.prev = startNode.node;
      startNode.next = currentNode.node;
    }
    if (currentNode.next === undefined) {
      currentNode.next = endNode.node;
      endNode.prev = currentNode.node;
    }
  });

  return nodes;
}
