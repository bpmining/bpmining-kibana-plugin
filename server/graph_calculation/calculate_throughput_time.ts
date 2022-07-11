import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { sortNodes } from './sort_nodes';

export function calculateNodeThroughputTime(node: ProcessEvent) {
  if (node.startTime && node.endTime) {
    const throughputTimeMilliseconds = node.endTime - node.startTime;
    const throughputTimeSeconds = throughputTimeMilliseconds / 1000;

    const throughputTime = new Date(0, 0);
    throughputTime.setSeconds(+throughputTimeSeconds);
    return throughputTime;
  }
  return undefined;
}

export function calculateEdgeThroughputTime(firstNode: VisNode, secondNode: VisNode) {
  const throughputTimeMilliseconds =
    secondNode.timestamp - (firstNode.startTime ? firstNode.startTime : firstNode.timestamp);
  const throughputTimeSeconds = throughputTimeMilliseconds / 1000;

  const throughputTime = new Date(0, 0);
  throughputTime.setSeconds(+throughputTimeSeconds);

  return throughputTime;
}

export function calculateGraphThroughputTime(nodes: VisNode[]) {
  const lastIndex = nodes.length - 1;
  const sortedNodes = sortNodes(nodes, 'timestamp');

  const throughputTimeMilliseconds = sortedNodes[lastIndex].timestamp - sortedNodes[0].timestamp;
  const throughputTimeSeconds = throughputTimeMilliseconds / 1000;

  const throughputTime = new Date(0, 0);
  throughputTime.setSeconds(+throughputTimeSeconds);

  const formatedTimeString = formatDateTime(throughputTime);
  return formatedTimeString;
}

export function formatDateTime(throughputTime: Date): string {
  let timeString = '';

  const hours = throughputTime.getHours();
  const minutes = throughputTime.getMinutes();
  const seconds = throughputTime.getSeconds();

  if (hours > 0) {
    timeString = `${hours}:${minutes} h`;
  } else if (minutes > 0) {
    timeString = `${minutes}:${seconds} min`;
  } else if (seconds > 0) {
    timeString = `${seconds} s`;
  } else {
    timeString = '0 s';
  }

  return timeString;
}

export function formatTime(throughputTime: number): string {
  let timeString = '';

  const hours = Math.floor(throughputTime / 3600);
  const minutes = Math.floor((throughputTime % 3600) / 60);
  const seconds = Math.floor(throughputTime % 60);

  if (hours > 0) {
    timeString = `${hours}:${minutes} h`;
  } else if (minutes > 0) {
    timeString = `${minutes}:${seconds} min`;
  } else if (seconds > 0) {
    timeString = `${seconds} s`;
  } else {
    timeString = '0 s';
  }

  return timeString;
}

export function convertDateToSeconds(throughputTime: Date): number {
  const hours = throughputTime.getHours();
  const minutes = throughputTime.getMinutes();
  const seconds = throughputTime.getSeconds();

  return hours * 60 * 60 + minutes * 60 + seconds;
}
