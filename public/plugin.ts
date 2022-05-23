import { CoreSetup, CoreStart, Plugin } from 'src/core/public';
import { DataPublicPluginSetup, DataPublicPluginStart } from 'src/plugins/data/public';
import { Plugin as ExpressionsPlugin } from 'src/plugins/expressions/public';
import { VisualizationsSetup } from 'src/plugins/visualizations/public';

import { processGraphVisFn } from './process_graph_vis_fn';
import { processGraphVisRenderer } from './process_graph_vis_renderer';
import { setData } from './services';

/** @internal */
export interface ProcessGraphVisualizationDependencies {
  core: CoreSetup;
  plugins: { data: DataPublicPluginSetup };
}

/** @internal */
export interface SetupDependencies {
  data: DataPublicPluginSetup;
  expressions: ReturnType<ExpressionsPlugin['setup']>;
  visualizations: VisualizationsSetup;
}

/** @internal */
export interface StartDependencies {
  data: DataPublicPluginStart;
}

export class BpminingPlugin implements Plugin<BpminingPluginSetup, BpminingPluginStart> {
  public setup(core: CoreSetup, { data, expressions, visualizations }: SetupDependencies) {
    const visualizationDependencies: Readonly<ProcessGraphVisualizationDependencies> = {
      core,
      plugins: {
        data,
      },
    };

    // Register an expression function with type "render" for the visualization
    expressions.registerFunction(() => processGraphVisFn(visualizationDependencies));

    // Register a renderer for the visualization
    expressions.registerRenderer(processGraphVisRenderer);
  }

  public start(core: CoreStart, { data }: StartDependencies) {
    setData(data);
  }

  public stop() {}
}

export type BpminingPluginSetup = ReturnType<BpminingPlugin['setup']>;
export type BpminingPluginStart = ReturnType<BpminingPlugin['start']>;
