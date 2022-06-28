import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export function assignNodeIds(sortedNodes: ProcessEvent[]): VisNode[] {
  const labels = sortedNodes.map((node) => node.label);
  const uniqueLabels = [...new Set(labels)];
  const nodesWithIds: VisNode[] = [];
  uniqueLabels.forEach((label, i) => {
    sortedNodes.forEach((node, j) => {
      if (node.label === label) {
        nodesWithIds.push({ ...node, id: i + 1 });
      }
    });
  });
  return nodesWithIds;
}
