import { VisNodeNeighbours } from '../graph_calculation/build_aggregated_graph';

export function addStartAndEndPoint(nodes: VisNodeNeighbours[], lastIndex: number, layer: number) {
  const startNode = {
    node: { label: '', id: 0 },
    prev: undefined,
    next: undefined,
  };
  const endNode = {
    node: { label: '', id: lastIndex + 1 },
    prev: undefined,
    next: undefined,
  };

  if (layer === 1) {
    Object.assign(startNode.node, { color: '#D6D1E5' }, { borderColor: '#5B4897' });
    Object.assign(endNode.node, { color: '#D6D1E5' }, { borderColor: '#5B4897' });
  } else {
    Object.assign(startNode.node, { color: '#F9C880' }, { borderColor: '#F39000' });
    Object.assign(endNode.node, { color: '#F9C880' }, { borderColor: '#F39000' });
  }

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
