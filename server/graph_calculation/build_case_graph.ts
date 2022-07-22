import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { addStartAndEndPoint } from '../helpers/add_start_end_point';
import { getNeighboursFor } from '../helpers/get_node_neighbours';
import { assignNodeIds } from './assign_node_ids';
import { assignNodeCoordinates } from './build_aggregated_graph';
import { calculateCaseGraphEdges } from './calculate_edges';
import {
  buildDateString,
  calculateGraphThroughputTime,
  calculateNodeThroughputTime,
  convertDateToSeconds,
  formatDateTime,
  formatTime,
} from './calculate_throughput_time';

export interface ProcessGraph {
  nodes: VisNode[];
  edges: VisEdge[];
}

export function buildCaseGraph(nodes: ProcessEvent[], layer: number) {
  if (nodes.length === 0) {
    return;
  }
  const nodesWithIds: VisNode[] = assignNodeIds(nodes);

  nodesWithIds.forEach(async (node, index) => {
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
      const drillDownGraph = buildCaseGraph(node.thirdPartyData, 2);
      Object.assign(node, { drillDownGraph: drillDownGraph });
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

  if (slowestNode.throughputTime !== undefined) {
    slowestNode.color = '#F9D0D2';
  }

  const nodesWithNeighbours = getNeighboursFor(nodesWithIds);
  const nodesWithEndpoints = addStartAndEndPoint(nodesWithNeighbours, nodes.length, layer);

  const finalNodes = nodesWithEndpoints.map((item) => item.node);
  const edges = calculateCaseGraphEdges(nodesWithEndpoints);

  const finalEdges: VisEdge[] = [];
  var slowestEdge = edges[0];
  var maxEdgeThroughputTime: number = 0;
  edges.forEach((edge) => {
    const throughputTime: number =
      edge.label.getHours() * 60 * 60 + edge.label.getMinutes() * 60 + edge.label.getSeconds();

    if (throughputTime > maxEdgeThroughputTime) {
      maxEdgeThroughputTime = throughputTime;
      slowestEdge = edge;
    }
    finalEdges.push({
      from: edge.from,
      to: edge.to,
      label: `${formatTime(throughputTime)}`,
    });
  });
  const index = finalEdges.findIndex(
    (edge) => edge.from === slowestEdge.from && edge.to === slowestEdge.to
  );
  Object.assign(finalEdges[index], { color: { color: 'E9454E', inherit: false }, width: 2 });
  const graphThroughputTime = calculateGraphThroughputTime(finalNodes);

  const nodesWithCoordinates = assignNodeCoordinates(finalNodes, finalEdges);
  const caseId = nodesWithCoordinates[1].caseID;

  const startTimestamp = buildDateString(
    nodesWithIds[0].startTime ? nodesWithIds[0].startTime : nodesWithIds[0].timestamp
  );
  const endTimestamp = buildDateString(
    nodesWithIds[nodesWithIds.length - 1].endTime
      ? nodesWithIds[nodesWithIds.length - 1].endTime
      : nodesWithIds[nodesWithIds.length - 1].timestamp
  );

  const graph = {
    nodes: nodesWithCoordinates,
    edges: finalEdges,
    throughputTime: graphThroughputTime,
    caseId: caseId,
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
  };

  return graph;
}
