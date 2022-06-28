import { VisNode, VisEdge } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export function assignEdge(from: VisNode, to: VisNode) {
  const edge: VisEdge = {
    from: from.id,
    to: to.id,
  };
  return edge;
}
