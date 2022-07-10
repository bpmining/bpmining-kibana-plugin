import { schema } from '@kbn/config-schema';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { IRouter, SearchResponse } from '../../../../src/core/server';
import { FETCH_PROCESS_DATA_CASE } from '../../common/routes';
import { ProcessEvent } from '../../model/process_event';
import { buildCaseGraph } from '../graph_calculation/build_case_graph';
import { extractPossibleCaseIds } from '../helpers/extract_possible_case_ids';
import { assignThirdPartyDataTo } from '../helpers/third_party_data';

export function caseProcessGraphRoute(router: IRouter) {
  router.post(
    {
      path: FETCH_PROCESS_DATA_CASE,
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
              filter: [{ term: { caseID: caseID } }],
            },
          },
          size: 100,
        },
      };

      const res = await context.core.elasticsearch.client.asCurrentUser.search(params);
      const hits = (res as SearchResponse<ProcessEvent>).hits.hits;

      const nodes: ProcessEvent[] = hits.map((hit) => ({ ...hit._source }));
      const nodesWithThirdPartyData = assignThirdPartyDataTo(nodes);
      const processNodes = nodesWithThirdPartyData.filter(
        (node: VisNode) => node.typ === 'process'
      );
      const layer = 1;
      const graph = buildCaseGraph(processNodes, layer);
      const caseIds = extractPossibleCaseIds(processNodes);
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
