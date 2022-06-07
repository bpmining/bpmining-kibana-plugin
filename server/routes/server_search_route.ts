import { schema } from '@kbn/config-schema';
import { Explanation } from 'src/core/server/elasticsearch/client/types';
import { IRouter, SearchResponse } from '../../../../src/core/server';
import { SERVER_SEARCH_ROUTE_PATH } from '../../common';

interface VisNode {
  label: string;
  caseID: string;

  startTime?: number; 
  endTime?: number;

  system?: string;
  typ?: 'process' | 'third-party';
  contextInfo?: object;
}

type ResponseObject = {
  _index: string; 
  _type: string; 
  _id: string; 
  _score: number; 
  _source: VisNode; 
  _version?: number | undefined; 
  _explanation?: Explanation | undefined;
  fields?: any;
  highlight?: any; 
  inner_hits?: any; 
  matched_queries?: string[] | undefined; 
  sort?: unknown[] | undefined;
}

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
        }
      };

      const res = await context.core.elasticsearch.client.asCurrentUser.search(params);
      let hits = (res as SearchResponse).hits.hits;

      const nodes: VisNode[] = [];
      for (let i = 0; i < hits.length; i++) {
        let node: ResponseObject = hits[i] as ResponseObject;

        let typ = node._source.typ;
        let label = node._source.label;
        let system = node._source.system;
        let contextInfo = node._source.contextInfo;
        let caseID = node._source.caseID;
        let startTime = node._source.startTime;
        let endTime = node._source.endTime;

        nodes.push({
          label: label,
          caseID: caseID,
          startTime: startTime,
          endTime: endTime, 
          system: system,
          typ: typ,
          contextInfo: contextInfo,
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
