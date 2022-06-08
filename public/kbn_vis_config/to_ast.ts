import { VisToExpressionAst } from 'src/plugins/visualizations/public';
import {
  buildExpression,
  buildExpressionFunction,
} from '../../../../src/plugins/expressions/public';
import { ProcessGraphVisExpressionFunctionDefinition } from './process_graph_vis_fn';
import { ProcessGraphVisParams } from '../types';

export const toExpressionAst: VisToExpressionAst<ProcessGraphVisParams> = (vis) => {
  const processGraphVis = buildExpressionFunction<ProcessGraphVisExpressionFunctionDefinition>(
    'process_graph',
    {
      ...vis.params,
      indexPatternId: vis.data.indexPattern!.id!,
    }
  );

  const ast = buildExpression([processGraphVis]);

  return ast.toAst();
};
