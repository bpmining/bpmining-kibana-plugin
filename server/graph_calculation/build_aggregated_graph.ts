import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { addStartAndEndPoint } from '../helpers/add_start_end_point';
import { getNeighboursFor } from '../helpers/get_node_neighbours';
import { splitNodesByCase } from '../helpers/split_nodes_by_case';
import { assignNodeIds } from './assign_node_ids';
import { calculateAggregatedGraphEdges } from './calculate_edges';
import { formatTime } from './calculate_edge_throughput_time';
import { calculateNodeThroughputTime } from './calculate_node_throughput_time';
import { sortNodes } from './sort_nodes';

export interface RawVisEdge {
  from: number;
  to: number;
  label: Date;
}

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
  if (nodes.length === 0) {
    return;
  }
  const sortedNodes = sortNodes(nodes, 'timestamp');
  const nodesWithIds: VisNode[] = assignNodeIds(sortedNodes);

  const nodeFrequencies = getNodeFrequencies(nodesWithIds);
  console.log(nodeFrequencies);

  const nodesPerCase: Array<VisNode[]> = splitNodesByCase(nodesWithIds);

  let nodesPerCaseWithNeighbours: Array<VisNodeNeighbours[]> = [];
  let edgesPerCase: Array<RawVisEdge[]> = [];
  nodesPerCase.forEach((oneCase) => {
    const caseWithNeighbours = getNeighboursFor(oneCase);
    const nodesWithEndpoints = addStartAndEndPoint(caseWithNeighbours, nodes);
    nodesPerCaseWithNeighbours.push(nodesWithEndpoints);

    const edges = calculateAggregatedGraphEdges(nodesWithEndpoints);
    edgesPerCase.push(edges);
  });

  const allNodes = flatten(nodesPerCaseWithNeighbours);
  const nodesUniqueByLabel = [
    ...new Map(allNodes.map((item: VisNodeNeighbours) => [item['node'].label, item])).values(),
  ];
  const aggregatedNodes = nodesUniqueByLabel.map((item: VisNodeNeighbours) => item.node);

  const allEdges: RawVisEdge[] = flatten(edgesPerCase);
  const aggregatedEdges = getAggregatedEdgesWithLabels(allEdges);

  /*   for (let node of nodesWithIds) {
    const throughputTime = calculateNodeThroughputTime(node);

    if (throughputTime !== undefined) {
      Object.assign(node, { throughputTime: throughputTime });
    }
  } */

  const graph = {
    nodes: aggregatedNodes,
    edges: aggregatedEdges,
  };

  return graph;
}

function flatten(array: any): Array<any> {
  return array.reduce(function (a: any, b: any) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
}

function getNodeFrequencies(nodesWithIds: VisNode[]) {
  const nodeIds = nodesWithIds.map((node) => node.id);
  const uniqueNodeIds = [...new Set(nodeIds)];

  let frequencies: any = [];
  uniqueNodeIds.forEach((id) => {
    const nodesWithCurrentId = nodesWithIds.filter((node) => node.id === id);
    frequencies.push({ id: id, frequency: nodesWithCurrentId.length });
  });
  return frequencies;
}

function getAggregatedEdgesWithLabels(edges: RawVisEdge[]) {
  const aggregatedEdges: VisEdge[] = [];
  const uniqueEdges = [
    ...edges
      .reduce((map, { from, to }) => {
        return map.set(`${from}-${to}`, { from, to });
      }, new Map())
      .values(),
  ];

  uniqueEdges.forEach((edge) => {
    const sameEdges = edges.filter((e) => e.from === edge.from && e.to === edge.to);
    const frequency = sameEdges.length;

    let throughputTime: number = 0;
    sameEdges.forEach((edge) => {
      throughputTime += edge.label.getTime();
    });
    const meanThroughputTime = throughputTime / frequency;

    aggregatedEdges.push({
      from: edge.from,
      to: edge.to,
      label: `${frequency}x 
      
      ${formatTime(new Date(meanThroughputTime))}`,
    });
  });

  return aggregatedEdges;
}
