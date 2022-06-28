import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { extractPossibleCaseIds } from './extract_possible_case_ids';

export function splitNodesByCase(nodes: VisNode[]): Array<VisNode[]> {
  const caseIds = extractPossibleCaseIds(nodes);
  const result: Array<VisNode[]> = [];
  caseIds.forEach((caseId) => {
    const nodesInCurrentCase = nodes.filter((node) => node.caseID === caseId);
    result.push(nodesInCurrentCase);
  });
  return result;
}
