// @ts-ignore
import Graph from 'react-graph-vis';
import React from 'react';
import { VisEdge, VisNode } from '../../../../model/vis_types';

export interface VisGraphComponentProps {
  nodes: VisNode[];
  edges: VisEdge[];
  color: string;
}

export function VisGraphComponent(props: VisGraphComponentProps) {
  const graph = {
    nodes: props.nodes,
    edges: props.edges,
  };

  const options = {
    autoResize: true,
    layout: {
      hierarchical: true,
    },
    nodes: {
      color: props.color,
      opacity: 0.5,
    },
    edges: {
      color: '#000000',
    },
    height: '980px',
  };

  /* const events = {
    select(event: { nodes: any; edges: any }) {
      const { nodes, edges } = event;
    },
  }; */

  // return <Graph graph={graph} options={options} events={events} />;
  return <Graph graph={graph} options={options} />;
}
