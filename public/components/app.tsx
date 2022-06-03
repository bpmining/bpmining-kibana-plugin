/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useEffect } from 'react';
import { ProcessGraphVisParams } from '../types';
import { MemoryRouter } from 'react-router-dom';
import { DashboardComponent } from './dashboard';

export interface VisNode {
  id: number;
  label: string;
}

export interface VisEdge {
  from: number;
  to: number;
}

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
    for (let i = 0; i < nodes.length - 1; i++) {
      let fromId = nodes[i].id;
      let toId = nodes[i].id + 1;
      edges.push({ from: fromId, to: toId });
      console.log(edges);
    }

    return (
      <MemoryRouter>
        <DashboardComponent nodes={nodes} edges={edges} />
      </MemoryRouter>
    );
  }
}
