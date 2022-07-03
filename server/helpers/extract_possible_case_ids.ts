import { flatten } from 'lodash';
import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';

export function extractPossibleCaseIds(nodes: ProcessEvent[] | ProcessEvent[][]) {
  const flattendNodes = flatten(nodes);
  const caseIds = flattendNodes.map((node) => node.caseID);
  const uniqueCaseIds = [...new Set(caseIds)];
  return uniqueCaseIds;
}
