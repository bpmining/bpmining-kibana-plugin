import { ExecutionContext, ExpressionFunctionDefinition, Render } from 'src/plugins/expressions/public';
import { KibanaContext, TimeRange, Query, ExecutionContextSearch } from 'src/plugins/data/public';
import { VisData, ProcessGraphVisParams } from './types';
import { ProcessGraphVisualizationDependencies } from './plugin';
import { createProcessGraphRequestHandler } from './process_graph_request_handler';
import { get } from 'lodash';
import { Adapters } from 'src/plugins/inspector';

export type VisParams = Required<ProcessGraphVisParams>;

export interface ProcessGraphVisRenderValue {
  visData: VisData;
  visType: 'process_graph';
  visConfig: VisParams;
}

type Input = KibanaContext | { type: 'null' };

type Output = Promise<Render<ProcessGraphVisRenderValue>>;

export type ProcessGraphVisExpressionFunctionDefinition = ExpressionFunctionDefinition<
  'process_graph',
  Input,
  ProcessGraphVisParams,
  Output,
  ExecutionContext<Adapters, ExecutionContextSearch>
>;

export const processGraphVisFn = (
  dependencies: ProcessGraphVisualizationDependencies
): ProcessGraphVisExpressionFunctionDefinition => ({
  name: 'process_graph',
  type: 'render',
  inputTypes: ['kibana_context', 'null'],
  help: 'The expression function definition should be registered for a custom visualization to be rendered',
  args: {
    indexPatternId: {
      types: ['string'],
      default: undefined,
      help: '',
    },
  },
  async fn(input, args): Output {
    const processGraphRequestHandler = createProcessGraphRequestHandler(dependencies);
    const response = await processGraphRequestHandler({
      timeRange: get(input, 'timeRange') as TimeRange,
      query: get(input, 'query') as Query,
      filters: get(input, 'filters') as any,
      visParams: args,
    });
    console.log('In Graph Function');
    console.log(response);
    return {
      type: 'render',
      as: 'process_graph_vis',
      value: {
        visData: response as VisData,
        visType: 'process_graph',
        visConfig: args,
      },
    };
  },
});
