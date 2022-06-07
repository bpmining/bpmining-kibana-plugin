import { IEsSearchRequest } from 'src/plugins/data/server';
import { schema } from '@kbn/config-schema';
import { IEsSearchResponse } from 'src/plugins/data/common';
import { IRouter } from '../../../../src/core/server';
import { SERVER_SEARCH_ROUTE_PATH } from '../../common';

export function registerServerSearchRoute(router: IRouter) {
  console.log('in Server Search Route');
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
        wait_for_completion_timeout: '5m',
        keep_alive: '5m',
      };
      const res = await context.search!.search({ params } as IEsSearchRequest, {}).toPromise();
      let hits = (res as IEsSearchResponse).rawResponse.hits.hits;
      console.log(hits.length);
      const nodes = [];
      for (let i = 0; i < hits.length; i++) {
        let node = hits[i];
        console.log(' 1 NODE: ');
        console.log(node);

        let typ = node._source.typ;
        let label = node._source.label;
        let system = node._source.system;
        let contextInfo = node._source.contextInfo;
        let caseID = node._source.caseID;
        let startTime = node._source.startTime;
        let endTime = node._source.endTime;

        nodes.push({
          typ: typ,
          label: label,
          system: system,
          contextInfo: contextInfo,
          caseID: caseID,
          startTime: startTime,
          endTime: endTime,
        });
      }

      return response.ok({
        body: {
          data: nodes,
        },
      });
    }
  );
}
