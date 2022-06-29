import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { addStartAndEndPoint } from '../helpers/add_start_end_point';
import { getNeighboursFor } from '../helpers/get_node_neighbours';
import { splitNodesByCase } from '../helpers/split_nodes_by_case';
import { assignNodeIds } from './assign_node_ids';
import { calculateEdges } from './calculate_edges';
import { calculateNodeThroughputTime } from './calculate_node_throughput_time';
import { sortNodes } from './sort_nodes';

export interface VisNodeNeighbours {
  node: any;
  prev: any;
  next: any;
}

export interface ProcessGraph {
  nodes: VisNode[];
  edges: VisEdge[];
}

export function buildAggregatedGraph(nodes: ProcessEvent[]) {
  const sortedNodes = sortNodes(nodes, 'timestamp');
  const nodesWithIds: VisNode[] = assignNodeIds(sortedNodes);
  const nodesPerCase: Array<VisNode[]> = splitNodesByCase(nodesWithIds);

  const nodesPerCaseWithNeighbours: Array<VisNodeNeighbours[]> = [];
  nodesPerCase.forEach((oneCase) => {
    const caseWithNeighbours = getNeighboursFor(oneCase);
    nodesPerCaseWithNeighbours.push(caseWithNeighbours);
  });

  const allNodes = flatten(nodesPerCaseWithNeighbours);
  const nodesUniqueByLabel = [
    ...new Map(allNodes.map((item: VisNodeNeighbours) => [item['node'].label, item])).values(),
  ];

  const nodesWithEndpoints = addStartAndEndPoint(nodesUniqueByLabel);

  const aggregatedNodes = nodesWithEndpoints.map((item: VisNodeNeighbours) => item.node);
  const aggregatedEdges = calculateEdges(nodesWithEndpoints);

  for (let node of nodesWithIds) {
    const throughputTime = calculateNodeThroughputTime(node);

    if (throughputTime !== undefined) {
      Object.assign(node, { throughputTime: throughputTime });
    }
  }

  const graph = {
    nodes: aggregatedNodes,
    edges: aggregatedEdges,
  };

  return graph;
}

function flatten(array: any): VisNodeNeighbours[] {
  return array.reduce(function (a: any, b: any) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
}
