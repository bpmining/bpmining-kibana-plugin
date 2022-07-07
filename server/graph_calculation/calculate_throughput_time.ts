import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { sortNodes } from './sort_nodes';

export function calculateNodeThroughputTime(node: ProcessEvent, nextNode: ProcessEvent) {
  if (node.startTime && node.endTime) {
    const throughputTimeMilliseconds = node.endTime - node.startTime;
    const throughputTimeSeconds = throughputTimeMilliseconds / 1000;

    const throughputTime = new Date(0, 0);
    throughputTime.setSeconds(+throughputTimeSeconds);

    return throughputTime;
  } else if (node.timestamp && nextNode.timestamp) {
    const throughputTimeMilliseconds = nextNode.timestamp - node.timestamp;
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

  const formatedTimeString = formatTime(throughputTime);
  return formatedTimeString;
}

export function formatTime(throughputTime: Date): string {
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
