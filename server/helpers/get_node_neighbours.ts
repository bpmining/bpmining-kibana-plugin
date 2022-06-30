import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { VisNodeNeighbours } from '../graph_calculation/build_aggregated_graph';

export function getNeighboursFor(nodes: VisNode[]): VisNodeNeighbours[] {
  let result: VisNodeNeighbours[] = [];
  nodes.map((node, i) => {
    const nodeWithNeighbours = {
      node: node,
      prev: nodes[i - 1],
      next: nodes[i + 1],
    };
    result.push(nodeWithNeighbours);
  });
  return result;
}
