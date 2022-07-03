import _ from 'lodash';
import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export function sortNodes(nodes: ProcessEvent[] | VisNode[], parameter: string): any {
  const sortedNodes = _.sortBy(nodes, parameter);
  return sortedNodes;
}
