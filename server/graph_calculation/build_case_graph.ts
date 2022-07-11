import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { addStartAndEndPoint } from '../helpers/add_start_end_point';
import { getNeighboursFor } from '../helpers/get_node_neighbours';
import { assignNodeIds } from './assign_node_ids';
import { calculateCaseGraphEdges } from './calculate_edges';
import {
  calculateGraphThroughputTime,
  calculateNodeThroughputTime,
  convertDateToSeconds,
  formatDateTime,
} from './calculate_throughput_time';
import { sortNodes } from './sort_nodes';

export interface ProcessGraph {
  nodes: VisNode[];
  edges: VisEdge[];
}

export function buildCaseGraph(nodes: ProcessEvent[], layer: number) {
  if (nodes.length === 0) {
    return;
  }
  const sortedNodes = sortNodes(nodes, 'timestamp');
  const nodesWithIds: VisNode[] = assignNodeIds(sortedNodes);

  nodesWithIds.forEach((node, index) => {
    let throughputTime = undefined;
    if (!node.startTime || !node.endTime) {
      if (layer === 1) {
        Object.assign(node, { color: '#D6D1E5' }, { borderColor: '#5B4897' });
      } else {
        Object.assign(node, { color: '#F9C880' }, { borderColor: '#F39000' });
      }
    } else {
      throughputTime = calculateNodeThroughputTime(node);
    }
    Object.assign(node, { throughputTime: throughputTime });
    const sameNodes = nodesWithIds.filter((n: VisNode) => n.id === node.id);
    const frequency = sameNodes.length;
    Object.assign(node, { frequency: frequency });

    if (node.label && throughputTime) {
      node.label += '|' + formatDateTime(new Date(throughputTime));
    } else {
      node.label += '| - ';
    }

    if (node.thirdPartyData) {
      node.label += '|third-party-data';
    }

    if (node.contextInfo) {
      const keys = Object.keys(node.contextInfo);
      let contextInformation = [];
      keys.forEach((key: string) => {
        const value = node.contextInfo[key];
        contextInformation.push(key + ': ' + value);
      });
      node.contextInfo = contextInformation;
    }

    if (layer === 1) {
      Object.assign(node, { color: '#D6D1E5' });
    } else {
      Object.assign(node, { color: '#F9C880' });
    }
  });

  const slowestNode = nodesWithIds.reduce((prev, current) => {
    const prevTime =
      prev.throughputTime === undefined ? 0 : convertDateToSeconds(prev.throughputTime);
    const currentTime =
      current.throughputTime === undefined ? 0 : convertDateToSeconds(current.throughputTime);
    return prevTime > currentTime ? prev : current;
  });
  slowestNode.color = '#F9D0D2';

  const nodesWithNeighbours = getNeighboursFor(nodesWithIds);
  const nodesWithEndpoints = addStartAndEndPoint(nodesWithNeighbours, nodes.length, layer);

  const finalNodes = nodesWithEndpoints.map((item) => item.node);
  const edges = calculateCaseGraphEdges(nodesWithEndpoints);

  const graphThroughputTime = calculateGraphThroughputTime(finalNodes);

  const graph = {
    nodes: finalNodes,
    edges: edges,
    throughputTime: graphThroughputTime,
  };

  return graph;
}
