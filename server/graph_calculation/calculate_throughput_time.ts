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
  let lastIndex = nodes.length - 1;
  if (nodes[lastIndex].timestamp === undefined) {
    lastIndex = nodes.length - 3;
  }
  const sortedNodes = sortNodes(nodes, 'timestamp');

  const throughputTimeMilliseconds = sortedNodes[lastIndex].timestamp - sortedNodes[0].timestamp;
  const throughputTimeSeconds = throughputTimeMilliseconds / 1000;

  return throughputTimeSeconds;
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
  let stringHours = hours.toString();
  stringHours = ('0' + stringHours).slice(-2);

  const minutes = Math.floor((throughputTime % 3600) / 60);
  let stringMinutes = minutes.toString();
  stringMinutes = ('0' + stringMinutes).slice(-2);

  const seconds = Math.floor(throughputTime % 60);
  let stringSeconds = seconds.toString();
  stringSeconds = ('0' + stringSeconds).slice(-2);

  if (hours > 0) {
    timeString = `${stringHours}:${stringMinutes} h`;
  } else if (minutes > 0) {
    timeString = `${stringMinutes}:${stringSeconds} min`;
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

export function buildDateString(timestamp: Date | number | undefined): string {
  if (timestamp) {
    if (typeof timestamp === 'number') {
      timestamp = new Date(timestamp);
    }

    const year = timestamp.getFullYear();
    let month = (timestamp.getMonth() + 1).toString();
    month = ('0' + month).slice(-2);
    let day = timestamp.getDate().toString();
    day = ('0' + day).slice(-2);

    let hours = timestamp.getHours().toString();
    hours = ('0' + hours).slice(-2);
    let minutes = timestamp.getMinutes().toString();
    minutes = ('0' + minutes).slice(-2);
    let seconds = timestamp.getSeconds().toString();
    seconds = ('0' + seconds).slice(-2);

    return `${day}.${month}.${year}|${hours}:${minutes}:${seconds}`;
  }

  return '';
}
