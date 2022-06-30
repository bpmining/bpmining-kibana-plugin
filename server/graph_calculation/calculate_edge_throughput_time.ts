import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export function calculateEdgeThroughputTime(firstNode: VisNode, secondNode: VisNode) {
  const throughputTimeMilliseconds =
    secondNode.timestamp - (firstNode.startTime ? firstNode.startTime : firstNode.timestamp);
  const throughputTimeSeconds = throughputTimeMilliseconds / 1000;

  const throughputTime = new Date(0, 0);
  throughputTime.setSeconds(+throughputTimeSeconds);

  return throughputTime;
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
