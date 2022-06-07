import React, { useEffect } from 'react';
import { ProcessGraphVisParams } from '../types';
import { MemoryRouter } from 'react-router-dom';
import { DashboardComponent } from './dashboard';
import { VisNode, VisEdge } from '../types';


export interface RawVisData {
  data: VisNode[];
}

interface ProcessGraphComponentProps {
  renderComplete(): void;
  visParams: ProcessGraphVisParams;
  visData: RawVisData;
}

export function BpminingApp(props: ProcessGraphComponentProps) {
  useEffect(() => {
    props.renderComplete();
  });

  let nodes: VisNode[] = props.visData.data;
  console.log(nodes);
  if (nodes === undefined) {
    console.log('no nodes');
    return <div> No graph can be shown.</div>;
  } else {
    let edges: VisEdge[] = [];

    return (
      <MemoryRouter>
        <DashboardComponent nodes={nodes} edges={edges} />
      </MemoryRouter>
    );
  }
}
