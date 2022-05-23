/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { ExpressionRenderDefinition } from 'src/plugins/expressions';
import { BpminingApp } from './components/app';
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
