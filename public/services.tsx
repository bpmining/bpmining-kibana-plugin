import { HttpSetup } from 'kibana/public';
import { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { createGetterSetter } from '../../../src/plugins/kibana_utils/public';
import { COLOR_LAYER_1, COLOR_LAYER_2 } from '../common/colors';

export const [getData, setData] = createGetterSetter<DataPublicPluginStart>('Data');

export const [getSearchService, setSearchService] = createGetterSetter<HttpSetup>('Search');

export function calculateColorValue(layer: number) {
  if (layer === 1) {
    return COLOR_LAYER_1;
  } else if (layer === 2) {
    return COLOR_LAYER_2;
  } else {
    throw new Error('Layer value out of scope.');
  }
}
