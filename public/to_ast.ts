/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { VisToExpressionAst } from 'src/plugins/visualizations/public';
import {
  buildExpression,
  buildExpressionFunction,
} from '../../../src/plugins/expressions/public';
import { ProcessGraphVisExpressionFunctionDefinition } from './process_graph_vis_fn';
import { ProcessGraphVisParams } from './types';

export const toExpressionAst: VisToExpressionAst<ProcessGraphVisParams> = (vis) => {
  const processGraphVis = buildExpressionFunction<ProcessGraphVisExpressionFunctionDefinition>( 'process_graph', {
    ...vis.params,
    indexPatternId: vis.data.indexPattern!.id!,
  });

  const ast = buildExpression([processGraphVis]);

  return ast.toAst();
}; 
