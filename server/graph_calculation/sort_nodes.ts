import _ from 'lodash';
import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';

export function sortNodes(nodes: ProcessEvent[], parameter: string) {
  const sortedNodes = _.sortBy(nodes, parameter);
  return sortedNodes;
}
