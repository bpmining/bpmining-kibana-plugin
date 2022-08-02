import { schema } from '@kbn/config-schema';
import { IRouter, SearchResponse } from '../../../../src/core/server';
import { FETCH_CYCLE_TIME_DATA } from '../../common/routes';
import { ProcessEvent } from '../../model/process_event';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { splitNodesByCase } from '../helpers/split_nodes_by_case';
import { assignNodeIds } from '../graph_calculation/assign_node_ids';
import { calculateGraphThroughputTime } from '../graph_calculation/calculate_throughput_time';
import _ from 'lodash';
import {
  calculateCycleTimeBuckets,
  CycleTimeGroupItem,
} from '../filter_calculation/calculate_cycle_time_buckets';

export interface CycleTimeItem {
  caseId: string;
  cycleTimeInSeconds: number;
  nodes: VisNode[];
}

export function processGraphCycleTimesRoute(router: IRouter) {
  router.post(
    {
      path: FETCH_CYCLE_TIME_DATA,
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
      const nodesWithIds: VisNode[] = assignNodeIds(nodes);
      const nodesPerCase: Array<VisNode[]> = splitNodesByCase(nodesWithIds);

      const cycleTimes: CycleTimeItem[] = [];
      nodesPerCase.forEach((oneCase) => {
        const caseId = oneCase[0].caseID;
        const nodes = oneCase;
        const cycleTime = calculateGraphThroughputTime(oneCase);
        cycleTimes.push({ caseId: caseId, cycleTimeInSeconds: cycleTime, nodes: nodes });
      });

      let sortedCycleTimes = _.sortBy(cycleTimes, 'cycleTimeInSeconds');

      const cycleTimeBuckets: CycleTimeGroupItem[] = calculateCycleTimeBuckets(
        sortedCycleTimes.reverse(),
        1
      );
      const data = {
        cycleTimeGroups: cycleTimeBuckets,
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
