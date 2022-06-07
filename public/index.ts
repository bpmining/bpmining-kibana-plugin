
import { PluginInitializer } from 'kibana/public';
import './index.scss';

import { BpminingPlugin, BpminingPluginSetup, BpminingPluginStart } from './plugin';

export { BpminingPlugin as Plugin };

export const plugin: PluginInitializer<BpminingPluginSetup, BpminingPluginStart> = () =>
  new BpminingPlugin();
