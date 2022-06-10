import { schema } from '@kbn/config-schema';
import { IRouter, SearchResponse } from '../../../../src/core/server';
import { SERVER_SEARCH_ROUTE_PATH } from '../../common';
import { ProcessEvent } from '../../model/process_event';

export function registerServerSearchRoute(router: IRouter) {
  router.post(
    {
      path: SERVER_SEARCH_ROUTE_PATH,
      validate: {
        body: schema.object({
          index: schema.string(),
          filtersDsl: schema.any(),
          timeFieldName: schema.string(),
          timeRangeFrom: schema.oneOf([schema.number(), schema.string()]),
          timeRangeTo: schema.oneOf([schema.number(), schema.string()]),
        }),
      },
    },
    async (context, request, response) => {
      const { index, filtersDsl, timeFieldName, timeRangeFrom, timeRangeTo } = request.body;
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
            },
          },
          size: 100,
        },
      };

      const res = await context.core.elasticsearch.client.asCurrentUser.search(params);
      const hits = (res as SearchResponse<ProcessEvent>).hits.hits;

      const nodes: ProcessEvent[] = hits.map((hit) => ({ ...hit._source }));

      return response.ok({
        body: {
          data: nodes,
        },
      });
    }
  );
}
