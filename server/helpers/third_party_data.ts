import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { flatten } from '../graph_calculation/build_aggregated_graph';
import { sortNodes } from '../graph_calculation/sort_nodes';

export function assignThirdPartyDataTo(nodes: ProcessEvent[]) {
  const sortedNodes = sortNodes(nodes, 'timestamp');
  sortedNodes.forEach((node: ProcessEvent, index: number) => {
    const currentTyp = node.typ;
    let nextTyp = undefined;
    const nextNode = sortedNodes[index + 1];
    if (nextNode) {
      nextTyp = nextNode.typ;
    }

    if (currentTyp === 'process' && nextTyp === 'third-party') {
      const thirdPartyData: ProcessEvent[] = [];
      getThirdPartyNodes(sortedNodes, index + 1, thirdPartyData);
      Object.assign(node, { thirdPartyData: thirdPartyData });
    }
  });
  return sortedNodes;
}

export function bundleThirdPartyNodes(nodes: VisNode[]): Array<VisNode[]> {
  const sortedNodes: VisNode[] | ProcessEvent[] = sortNodes(nodes, 'timestamp');
  const allThirdPartyNodes: Array<VisNode[]> = [];
  sortedNodes.forEach((node, index) => {
    const currentTyp = node.typ;
    let nextTyp = undefined;
    const nextNode = sortedNodes[index + 1];
    if (nextNode) {
      nextTyp = nextNode.typ;
    }

    if (currentTyp === 'third-party' && !flatten(allThirdPartyNodes).includes(node)) {
      const thirdPartyData: VisNode[] = [];
      getThirdPartyNodes(sortedNodes, index, thirdPartyData);
      allThirdPartyNodes.push(thirdPartyData);
    }
  });
  return allThirdPartyNodes;
}

function getThirdPartyNodes(sortedNodes: any, index: number, thirdPartyData: any) {
  const currentNode = sortedNodes[index];
  const nextNode = sortedNodes[index + 1];
  thirdPartyData.push(currentNode);
  if (nextNode.typ === 'third-party') {
    getThirdPartyNodes(sortedNodes, index + 1, thirdPartyData);
  } else {
    return;
  }
}
