import { Filter, buildEsQuery } from '@kbn/es-query';
import { TimeRange, Query, getEsQueryConfig } from '../../../src/plugins/data/public';

import { SERVER_SEARCH_ROUTE_PATH } from '../common';

import { ProcessGraphVisualizationDependencies } from './plugin';
import { getData } from './services';
import { ProcessGraphVisParams } from './types';

interface ProcessGraphRequestHandlerParams {
  query: Query;
  filters: Filter;
  timeRange: TimeRange;
  visParams: ProcessGraphVisParams;
}

export function createProcessGraphRequestHandler({
  core: { http, uiSettings },
}: ProcessGraphVisualizationDependencies) {
  const { dataViews } = getData();

  return async ({ timeRange, filters, query, visParams }: ProcessGraphRequestHandlerParams) => {
    const index = await dataViews.get(visParams.indexPatternId);
    const esQueryConfigs = getEsQueryConfig(uiSettings);
    const filtersDsl = buildEsQuery(undefined, query, filters, esQueryConfigs);

    return await http.post(SERVER_SEARCH_ROUTE_PATH, {
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
