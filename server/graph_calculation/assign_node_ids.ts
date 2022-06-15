import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';

export function assignNodeIds(sortedNodes: ProcessEvent[]) {
  for (let i = 0; i < sortedNodes.length; i++) {
    Object.assign(sortedNodes[i], { id: i });
  }
  return sortedNodes;
}
