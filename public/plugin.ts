import { CoreSetup, CoreStart, Plugin } from 'src/core/public';
import {
  DataPublicPluginSetup,
  DataPublicPluginStart,
  getEsQueryConfig,
} from 'src/plugins/data/public';
import { Plugin as ExpressionsPlugin } from 'src/plugins/expressions/public';
import { VisualizationsSetup } from 'src/plugins/visualizations/public';

import { createProcessGraphTypeDefinition } from './plugin_registration_config/type_definition';
import { processGraphVisFn } from './plugin_registration_config/visualization_fn';
import { processGraphVisRenderer } from './plugin_registration_config/visualization_renderer';
import { getData, setData } from './services';

export interface ProcessGraphVisualizationDependencies {
  core: CoreSetup;
  plugins: { data: DataPublicPluginSetup };
}

export interface SetupDependencies {
  data: DataPublicPluginSetup;
  expressions: ReturnType<ExpressionsPlugin['setup']>;
  visualizations: VisualizationsSetup;
}

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

    // Create the visualization type with definition
    visualizations.createBaseVisualization(createProcessGraphTypeDefinition());
  }

  public start(core: CoreStart, { data }: StartDependencies) {
    setData(data);
  }

  public stop() {}
}

export type BpminingPluginSetup = ReturnType<BpminingPlugin['setup']>;
export type BpminingPluginStart = ReturnType<BpminingPlugin['start']>;
