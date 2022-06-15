import _ from 'lodash';
import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';

export function calculateNodeThroughputTime(node: ProcessEvent) {
  if (node.startTime && node.endTime) {
    const throughputTimeMilliseconds = node.endTime - node.startTime;
    const throughputTimeSeconds = throughputTimeMilliseconds / 1000;

    const throughputTime = new Date(0, 0);
    throughputTime.setSeconds(+throughputTimeSeconds);

    const formatedTimeString = throughputTime.toTimeString().slice(0, 8);
    return formatedTimeString;
  }
  return undefined;
}
