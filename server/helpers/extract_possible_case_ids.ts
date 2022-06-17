import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';

export function extractPossibleCaseIds(nodes: ProcessEvent[]) {
  const caseIds = nodes.map((node) => node.caseID);
  const uniqueCaseIds = [...new Set(caseIds)];
  return uniqueCaseIds;
}
