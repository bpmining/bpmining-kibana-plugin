import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ExpressionRenderDefinition } from 'src/plugins/expressions';
import { BpminingApp } from '../components/app';
import { ProcessGraphVisRenderValue } from './process_graph_vis_fn';

export const processGraphVisRenderer: ExpressionRenderDefinition<ProcessGraphVisRenderValue> = {
  name: 'process_graph_vis',
  reuseDomNode: true,
  render: (domNode, config, handlers) => {
    handlers.onDestroy(() => {
      unmountComponentAtNode(domNode);
    });

    render(<BpminingApp renderComplete={handlers.done} {...config} />, domNode);
  },
};
