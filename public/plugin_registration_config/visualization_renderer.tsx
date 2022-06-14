import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { ExpressionRenderDefinition } from 'src/plugins/expressions';
import { BpminingApp } from '../components/app';
import { rootReducer } from '../reducer/root_reducer';
import { ProcessGraphVisRenderValue } from './visualization_fn';

// create redux store
const store = configureStore({
  reducer: { rootReducer },
});

export const processGraphVisRenderer: ExpressionRenderDefinition<ProcessGraphVisRenderValue> = {
  name: 'process_graph_vis',
  reuseDomNode: true,
  render: (domNode, config, handlers) => {
    handlers.onDestroy(() => {
      unmountComponentAtNode(domNode);
    });

    render(
      <Provider store={store}>
        <BpminingApp renderComplete={handlers.done} {...config} />
      </Provider>,
      domNode
    );
  },
};
