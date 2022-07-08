import { schema } from '@kbn/config-schema';
import { IRouter, SearchResponse } from '../../../../src/core/server';
import { FETCH_THIRD_PARTY_DATA_CASE } from '../../common/routes';
import { ProcessEvent } from '../../model/process_event';
import { buildCaseGraph } from '../graph_calculation/build_case_graph';
import { extractPossibleCaseIds } from '../helpers/extract_possible_case_ids';

export function caseThirdPartyGraphRoute(router: IRouter) {
  router.post(
    {
      path: FETCH_THIRD_PARTY_DATA_CASE,
      validate: {
        body: schema.object({
          index: schema.string(),
          filtersDsl: schema.any(),
          timeFieldName: schema.string(),
          timeRangeFrom: schema.oneOf([schema.number(), schema.string()]),
          timeRangeTo: schema.oneOf([schema.number(), schema.string()]),
          caseID: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      const { index, filtersDsl, timeFieldName, timeRangeFrom, timeRangeTo, caseID } = request.body;
      const params = {
        index,
        body: {
          query: {
            bool: {
              must: [
                filtersDsl,
                {
                  range: {
                    [timeFieldName]: {
                      gte: timeRangeFrom,
                      lt: timeRangeTo,
                    },
                  },
                },
              ],
              filter: [{ term: { typ: 'third-party' } }, { term: { caseID: caseID } }],
            },
          },
          size: 100,
        },
      };

      const res = await context.core.elasticsearch.client.asCurrentUser.search(params);
      const hits = (res as SearchResponse<ProcessEvent>).hits.hits;

      const nodes: ProcessEvent[] = hits.map((hit) => ({ ...hit._source }));

      const layer = 2;
      const graph = buildCaseGraph(nodes, layer);
      const caseIds = extractPossibleCaseIds(nodes);
      const caseCount = caseIds.length;

      const data = {
        graph: graph,
        caseIds: caseIds,
        caseCount: caseCount,
      };

      return response.ok({
        body: {
          data: data,
          index: index,
          filter: filtersDsl,
          timeFieldName: timeFieldName,
          timeRangeFrom: timeRangeFrom,
          timeRangeTo: timeRangeTo,
        },
      });
    }
  );
}
