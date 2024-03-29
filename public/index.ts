import { PluginInitializer } from 'src/core/public';
import { BpminingPlugin, BpminingPluginSetup, BpminingPluginStart } from './plugin';

export { BpminingPlugin as Plugin };

export const plugin: PluginInitializer<BpminingPluginSetup, BpminingPluginStart> = () =>
  new BpminingPlugin();
