import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { addStartAndEndPoint } from '../helpers/add_start_end_point';
import { getNeighboursFor } from '../helpers/get_node_neighbours';
import { splitNodesByCase } from '../helpers/split_nodes_by_case';
import { assignNodeIds } from './assign_node_ids';
import { calculateAggregatedGraphEdges } from './calculate_edges';
import {
  calculateNodeThroughputTime,
  convertDateToSeconds,
  formatTime,
} from './calculate_throughput_time';
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

export function buildAggregatedGraph(nodes: ProcessEvent[], layer: number) {
  if (nodes.length === 0) {
    return;
  }
  const sortedNodes = sortNodes(nodes, 'timestamp');
  const nodesWithIds: VisNode[] = assignNodeIds(sortedNodes);

  nodesWithIds.forEach((node, index) => {
    if (!nodesWithIds[index + 1] && !node.startTime && !node.endTime) {
      if (layer === 1) {
        Object.assign(node, { color: '#D6D1E5' }, { borderColor: '#5B4897' });
      } else {
        Object.assign(node, { color: '#F9C880' }, { borderColor: '#F39000' });
      }
      return;
    }
    const throughputTime = calculateNodeThroughputTime(node, nodesWithIds[index + 1]);

    if (throughputTime !== undefined) {
      Object.assign(node, { throughputTime: throughputTime });
    }
    if (layer === 1) {
      Object.assign(node, { color: '#D6D1E5' }, { borderColor: '#828282' });
    } else {
      Object.assign(node, { color: '#F9C880' }, { borderColor: '#828282' });
    }
  });
  const nodesPerCase: Array<VisNode[]> = splitNodesByCase(nodesWithIds);

  let nodesPerCaseWithNeighbours: Array<VisNodeNeighbours[]> = [];
  let edgesPerCase: Array<RawVisEdge[]> = [];
  nodesPerCase.forEach((oneCase) => {
    const caseWithNeighbours = getNeighboursFor(oneCase);
    const nodesWithEndpoints = addStartAndEndPoint(caseWithNeighbours, nodes.length, layer);
    nodesPerCaseWithNeighbours.push(nodesWithEndpoints);

    const edges = calculateAggregatedGraphEdges(nodesWithEndpoints);
    edgesPerCase.push(edges);
  });

  const allNodes = flatten(nodesPerCaseWithNeighbours);
  const aggregatedNodes = getAggregatedNodes(allNodes);

  const allEdges: RawVisEdge[] = flatten(edgesPerCase);
  const aggregatedEdges = getAggregatedEdgesWithLabels(allEdges);

  const graph = {
    nodes: aggregatedNodes,
    edges: aggregatedEdges,
  };

  return graph;
}

export function flatten(array: any): Array<any> {
  return array.reduce(function (a: any, b: any) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
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

function getAggregatedNodes(allNodes: VisNodeNeighbours[]): VisNode[] {
  const nodesUniqueById = [
    ...new Map(allNodes.map((item: VisNodeNeighbours) => [item['node'].id, item])).values(),
  ];
  const uniqueNodes: VisNode[] = nodesUniqueById.map((item: VisNodeNeighbours) => item.node);
  uniqueNodes.forEach((node) => {
    const sameNodes = allNodes.filter((n: VisNodeNeighbours) => n.node.id === node.id);
    const frequency = sameNodes.length;

    let throughputTime: number = 0;
    sameNodes.forEach((node) => {
      if (node.node.throughputTime !== undefined) {
        throughputTime += node.node.throughputTime.getTime();
      }
    });
    const meanThroughputTime = throughputTime === 0 ? 0 : throughputTime / frequency;
    Object.assign(node, { meanThroughputTime: meanThroughputTime });
    if (node.label) {
      node.label += '|' + frequency;
      node.label += meanThroughputTime
        ? ' / ' + formatTime(new Date(meanThroughputTime))
        : ' / no data available';
      if (node.thirdPartyData) {
        node.label += '|third-party-data';
      }
    }
  });

  const slowestNode = uniqueNodes.reduce((prev, current) => {
    const prevTime =
      prev.meanThroughputTime === 0 ? 0 : convertDateToSeconds(new Date(prev.meanThroughputTime));
    const currentTime =
      current.meanThroughputTime === 0
        ? 0
        : convertDateToSeconds(new Date(current.meanThroughputTime));
    return prevTime > currentTime ? prev : current;
  });

  slowestNode.color = '#F9D0D2';

  return uniqueNodes;
}
