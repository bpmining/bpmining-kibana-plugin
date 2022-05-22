import "./index.scss";

import { BpminingPlugin } from "./plugin";

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new BpminingPlugin();
}
export { BpminingPluginSetup, BpminingPluginStart } from "./types";
