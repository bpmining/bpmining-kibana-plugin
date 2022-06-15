import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { assignNodeIds } from './assign_node_ids';
import { calculateEdges } from './calculate_edges';
import { calculateNodeThroughputTime } from './calculate_node_throughput_time';
import { sortNodes } from './sort_nodes';

export function buildCaseGraph(nodes: ProcessEvent[]) {
  const sortedNodes = sortNodes(nodes, 'timestamp');
  const nodesWithIds: VisNode[] = assignNodeIds(sortedNodes);
  const edges = calculateEdges(nodesWithIds);

  for (let node of nodesWithIds) {
    const throughputTime = calculateNodeThroughputTime(node);

    if (throughputTime !== undefined) {
      Object.assign(node, { throughputTime: throughputTime });
    }
  }

  const graph = {
    nodes: nodesWithIds,
    edges: edges,
  };

  return graph;
}
