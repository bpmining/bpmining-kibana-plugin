import { ProcessGraphVisualizationDependencies } from '../plugin';
import { getData } from '../services';
import { buildEsQuery } from '@kbn/es-query';
import { getEsQueryConfig } from '../../../../src/plugins/data/public';
import { FETCH_PROCESS_DATA } from 'plugins/bpmining-kibana-plugin/common/routes';
import { ProcessGraphRequestHandlerParams } from '../plugin_registration_config/request_handler';

export function fetchAggregatedProcessGraph() {
  console.log('Fetch aggregated process graph.');
}

export function fetchAggregatedThirdPartyGraph({
  core: { http, uiSettings },
}: ProcessGraphVisualizationDependencies) {
  const { dataViews } = getData();

  return async ({ timeRange, filters, query, visParams }: ProcessGraphRequestHandlerParams) => {
    const index = await dataViews.get(visParams.indexPatternId);
    const esQueryConfigs = getEsQueryConfig(uiSettings);
    const filtersDsl = buildEsQuery(undefined, query, filters, esQueryConfigs);

    return await http.post(FETCH_PROCESS_DATA, {
      body: JSON.stringify({
        index: index.title,
        filtersDsl,
        timeFieldName: index.timeFieldName,
        timeRangeFrom: timeRange.from,
        timeRangeTo: timeRange.to,
      }),
    });
  };
}
