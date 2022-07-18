import _ from 'lodash';
import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { addStartAndEndPoint } from '../helpers/add_start_end_point';
import { getNeighboursFor } from '../helpers/get_node_neighbours';
import { splitNodesByCase } from '../helpers/split_nodes_by_case';
import { assignNodeIds } from './assign_node_ids';
import { calculateAggregatedGraphEdges } from './calculate_edges';
import {
  calculateNodeThroughputTime,
  formatDateTime,
  formatTime,
} from './calculate_throughput_time';

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

  /* const sortedNodes = sortNodes(nodes, 'timestamp'); */
  const nodesWithIds: VisNode[] = assignNodeIds(nodes);

  nodesWithIds.forEach((node, index) => {
    if (!nodesWithIds[index + 1] && !node.startTime && !node.endTime) {
      if (layer === 1) {
        Object.assign(node, { color: '#D6D1E5' }, { borderColor: '#5B4897' });
      } else {
        Object.assign(node, { color: '#F9C880' }, { borderColor: '#F39000' });
      }
      return;
    }
    const throughputTime = calculateNodeThroughputTime(node);

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

  const nodesWithCoordinates = assignNodeCoordinates(aggregatedNodes, aggregatedEdges);

  const graph = {
    nodes: nodesWithCoordinates,
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

  var slowestEdge = uniqueEdges[0];
  var maxEdgeThroughputTime: number = 0;

  uniqueEdges.forEach((edge) => {
    const sameEdges = edges.filter((e) => e.from === edge.from && e.to === edge.to);
    const frequency = sameEdges.length;

    let throughputTime: number = 0;
    sameEdges.forEach((edge) => {
      throughputTime += edge.label.getHours() * 60 * 60;
      throughputTime += edge.label.getMinutes() * 60;
      throughputTime += edge.label.getSeconds();
    });
    const meanThroughputTime = throughputTime / frequency;
    if (meanThroughputTime > maxEdgeThroughputTime) {
      maxEdgeThroughputTime = meanThroughputTime;
      slowestEdge = edge;
    }
    aggregatedEdges.push({
      from: edge.from,
      to: edge.to,
      label: `${frequency}x 
      
      ${formatTime(meanThroughputTime)}`,
    });
  });

  const index = aggregatedEdges.findIndex(
    (edge) => edge.from === slowestEdge.from && edge.to === slowestEdge.to
  );
  Object.assign(aggregatedEdges[index], { color: { color: 'E9454E', inherit: false }, width: 2 });
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

    const minThroughputTime = Math.min(...sameNodes.map((node) => node.node.throughputTime));
    Object.assign(node, { minThroughputTime: formatDateTime(new Date(minThroughputTime)) });
    const maxThroughputTime = Math.max(...sameNodes.map((node) => node.node.throughputTime));
    Object.assign(node, { maxThroughputTime: formatDateTime(new Date(maxThroughputTime)) });

    let throughputTime: number = 0;
    let thirdPartyNodes: VisNode[] = [];
    sameNodes.forEach((node) => {
      if (node.node.throughputTime !== undefined) {
        throughputTime += node.node.throughputTime.getHours() * 60 * 60;
        throughputTime += node.node.throughputTime.getMinutes() * 60;
        throughputTime += node.node.throughputTime.getSeconds();
      }
      if (node.node.thirdPartyData) {
        thirdPartyNodes = thirdPartyNodes.concat(node.node.thirdPartyData);
      }
    });

    if (thirdPartyNodes && node.thirdPartyData) {
      Object.assign(node, { drillDownGraph: buildAggregatedGraph(thirdPartyNodes, 2) });
    }

    const totalThroughputTime = throughputTime === 0 ? '-' : formatTime(throughputTime);
    Object.assign(node, { totalThroughputTime: totalThroughputTime });
    const meanThroughputTime = throughputTime === 0 ? 0 : throughputTime / frequency;
    Object.assign(node, { meanThroughputTime: meanThroughputTime });

    if (node.label) {
      node.label += '|' + frequency;
      node.label += ' / ' + (meanThroughputTime === 0 ? '-' : formatTime(meanThroughputTime));
      if (node.thirdPartyData) {
        node.label += '|third-party-data';
      }
    }
  });

  const slowestNode = uniqueNodes.reduce((prev, current) => {
    const prevTime = prev.meanThroughputTime === 0 ? 0 : prev.meanThroughputTime;
    const currentTime = current.meanThroughputTime === 0 ? 0 : current.meanThroughputTime;
    return prevTime > currentTime ? prev : current;
  });
  if (slowestNode.meanThroughputTime !== 0) {
    slowestNode.color = '#F9D0D2';
  }

  return uniqueNodes;
}

export function assignNodeCoordinates(allNodes: VisNode[], allEdges: VisEdge[]) {
  var dagre = require('dagre');
  var g = new dagre.graphlib.Graph();

  g.setGraph({});
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  allNodes.forEach((node) => {
    g.setNode(node.id, { label: node.label });
  });

  allEdges.forEach((edge) => {
    g.setEdge(edge.from, edge.to);
  });

  dagre.layout(g);

  g.nodes().forEach(function (v) {
    Object.assign(
      allNodes.find((node) => node.id === parseInt(v)),
      { x: g.node(v).x * 5, y: g.node(v).y * 5 }
    );
  });

  return allNodes;
}
