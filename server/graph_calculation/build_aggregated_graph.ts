import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { getNeighboursFor } from '../helpers/get_node_neighbours';
import { splitNodesByCase } from '../helpers/split_nodes_by_case';
import { assignNodeIds } from './assign_node_ids';
import { calculateAggregatedEdges } from './calculate_aggregated_edges';
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

  const startNode = { id: 0, label: 'start' };
  const endNode = { id: sortedNodes.length + 1, label: 'end' };

  const allNodes = flatten(nodesPerCaseWithNeighbours);
  const nodesUniqueByLabel = [
    ...new Map(allNodes.map((item) => [item['node'].label, item])).values(),
  ];
  console.log(nodesUniqueByLabel);
  const aggregatedEdges = calculateAggregatedEdges(nodesUniqueByLabel);
  const aggregatedNodes = nodesUniqueByLabel.map((item) => item.node);
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

function flatten(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
}
