import { IEsSearchRequest } from 'src/plugins/data/server';
import { schema } from '@kbn/config-schema';
import { IEsSearchResponse } from 'src/plugins/data/common';
import { IRouter } from '../../../../src/core/server';
import { SERVER_SEARCH_ROUTE_PATH } from '../../common';

export function registerServerSearchRoute(router: IRouter) {
  console.log('in Server Search Route')
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
      const {
        index,
        filtersDsl,
        timeFieldName,
        timeRangeFrom,
        timeRangeTo,
      } = request.body;

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
        },
      };
      const res = await context.search!.search({ params } as IEsSearchRequest, {}).toPromise();
      const nodes = [];
      let hits = (res as IEsSearchResponse).rawResponse.hits.hits;
      for(let i=0; i < hits.length; i++){
        let node = hits[i];
        console.log(" 1 NODE: ")
        console.log(node)
        let id = parseInt(node._source.id)
        let label = node._source.label
        
       nodes.push({id: id, label: label})
      }

      return response.ok({
        body: {
          timeFieldName: timeFieldName,
          data: nodes
        },
      });
    }
  );
}
