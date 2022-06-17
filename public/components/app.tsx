import React, { useEffect } from 'react';
import { ProcessGraphVisParams } from '../types';
import { MemoryRouter } from 'react-router-dom';
import { LayoutComponent } from './pages/layout';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';

export interface RawResponseData {
  data: VisNode[];
  index: any;
  filter: any;
  timeFieldName: string;
  timeRangeFrom: any;
  timeRangeTo: any;
}

interface ProcessGraphComponentProps {
  renderComplete(): void;
  visParams: ProcessGraphVisParams;
  visData: RawResponseData;
}

export function BpminingApp(props: ProcessGraphComponentProps) {
  useEffect(() => {
    props.renderComplete();
  });

  let nodes: VisNode[] = props.visData.data;
  if (nodes === undefined) {
    console.log('no nodes');
    return <div> No graph can be shown.</div>;
  } else {
    let edges: VisEdge[] = [];
    console.log(props.visData);
    return (
      <MemoryRouter>
        <LayoutComponent nodes={nodes} edges={edges} metadata={props.visData} />
      </MemoryRouter>
    );
  }
}
