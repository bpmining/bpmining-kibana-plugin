import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export function assignNodeIds(sortedNodes: ProcessEvent[]): VisNode[] {
  const nodesWithIds = sortedNodes.map((node, index) => {
    return { ...node, id: index };
  });
  return nodesWithIds;
}
