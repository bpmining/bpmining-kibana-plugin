import { PluginInitializerContext } from '../../../src/core/server';
import { BpminingPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new BpminingPlugin(initializerContext);
}

export { BpminingPluginSetup, BpminingPluginStart } from './types';
