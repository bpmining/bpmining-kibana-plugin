import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { sortNodes } from './sort_nodes';

export function calculateGraphThroughputTime(nodes: ProcessEvent[]) {
  const lastIndex = nodes.length - 1;
  const sortedNodes = sortNodes(nodes, 'timestamp');

  const throughputTimeMilliseconds = sortedNodes[lastIndex].timestamp - sortedNodes[0].timestamp;
  const throughputTimeSeconds = throughputTimeMilliseconds / 1000;

  const throughputTime = new Date(0, 0);
  throughputTime.setSeconds(+throughputTimeSeconds);

  const formatedTimeString = throughputTime.toTimeString().slice(0, 8);
  return formatedTimeString;
}
