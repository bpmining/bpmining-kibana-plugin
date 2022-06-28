import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { VisNodeNeighbours } from '../graph_calculation/build_aggregated_graph';

export function getNeighboursFor(nodes: VisNode[]): VisNodeNeighbours[] {
  let result: VisNodeNeighbours[] = [];
  nodes.map((node, i) => {
    const nodeWithNeighbours = {
      node: { label: node.label, id: node.id },
      prev: { label: nodes[i - 1]?.label, id: nodes[i - 1]?.id },
      next: { label: nodes[i + 1]?.label, id: nodes[i + 1]?.id },
    };
    result.push(nodeWithNeighbours);
  });
  return result;
}
