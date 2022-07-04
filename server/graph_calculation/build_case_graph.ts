import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { addStartAndEndPoint } from '../helpers/add_start_end_point';
import { getNeighboursFor } from '../helpers/get_node_neighbours';
import { assignNodeIds } from './assign_node_ids';
import { calculateCaseGraphEdges } from './calculate_edges';
import { calculateNodeThroughputTime } from './calculate_node_throughput_time';
import { sortNodes } from './sort_nodes';

export interface ProcessGraph {
  nodes: VisNode[];
  edges: VisEdge[];
}

export function buildCaseGraph(nodes: ProcessEvent[]) {
  if (nodes.length === 0) {
    return;
  }
  const sortedNodes = sortNodes(nodes, 'timestamp');
  const nodesWithIds: VisNode[] = assignNodeIds(sortedNodes);
  const nodesWithNeighbours = getNeighboursFor(nodesWithIds);
  const nodesWithEndpoints = addStartAndEndPoint(nodesWithNeighbours, nodes.length);

  const finalNodes = nodesWithEndpoints.map((item) => item.node);
  const edges = calculateCaseGraphEdges(nodesWithEndpoints);

  /* for (let node of nodesWithIds) {
    const throughputTime = calculateNodeThroughputTime(node);

    if (throughputTime !== undefined) {
      Object.assign(node, { throughputTime: throughputTime });
    }
  } */

  const graph = {
    nodes: finalNodes,
    edges: edges,
  };

  return graph;
}
