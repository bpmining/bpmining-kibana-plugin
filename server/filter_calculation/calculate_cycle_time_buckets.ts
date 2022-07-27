import _ from 'lodash';
import { ProcessEvent } from 'plugins/bpmining-kibana-plugin/model/process_event';
import { VisGraph } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { buildAggregatedGraph } from '../graph_calculation/build_aggregated_graph';
import { formatTime } from '../graph_calculation/calculate_throughput_time';
import { CycleTimeItem } from '../routes/process_graph_cycle_times_route';

export interface RawCycleTimeGroupItem {
  cases: CycleTimeItem[];
  interval: string;
}

export interface CycleTimeGroupItem {
  cases: CycleTimeItem[];
  graph: VisGraph | undefined;
  interval: string;
}

export function calculateCycleTimeBuckets(cycleTimes: CycleTimeItem[], layer: number) {
  const cycleTimeGroups: RawCycleTimeGroupItem[] = [];
  let cycleTimeGroupsWithGraphs: CycleTimeGroupItem[] = [];

  if (cycleTimes.length > 0) {
    const sortedCycleTimes = _.sortBy(cycleTimes, 'cycleTimeInSeconds');

    const longestCycleTime = sortedCycleTimes.pop()?.cycleTimeInSeconds;
    const shortestCycleTime = sortedCycleTimes[0].cycleTimeInSeconds;

    if (longestCycleTime && shortestCycleTime) {
      const difference = longestCycleTime - shortestCycleTime;
      const buckets = 10;
      const bucketSize = difference / buckets;

      for (let i = 9; i >= 0; i--) {
        const intervalMin = shortestCycleTime + bucketSize * i;
        const intervalMax = shortestCycleTime + bucketSize * i + bucketSize;
        const intervalString = `${formatTime(intervalMin)} - ${formatTime(intervalMax)}`;
        cycleTimes.forEach((item) => {
          const cycleTime = item.cycleTimeInSeconds;
          if (cycleTime >= intervalMin && cycleTime <= intervalMax) {
            const index = cycleTimeGroups.findIndex((item) => item.interval === intervalString);
            if (index != -1) {
              cycleTimeGroups[index].cases = cycleTimeGroups[index].cases.concat(item);
            } else {
              cycleTimeGroups.push({ cases: [item], interval: intervalString });
            }
          }
        });
      }

      cycleTimeGroups.forEach((item) => {
        const numberOfCases = item.cases.length;
        if (numberOfCases > 1) {
          const cases = item.cases;
          let nodesOfAllCases: ProcessEvent[] = [];
          cases.forEach((oneCase: CycleTimeItem) => {
            const nodes = oneCase.nodes;
            nodesOfAllCases = nodesOfAllCases.concat(nodes);
          });
          const graph = buildAggregatedGraph(nodesOfAllCases, layer);
          cycleTimeGroupsWithGraphs.push({
            interval: item.interval,
            cases: item.cases,
            graph: graph,
          });
        } else {
          cycleTimeGroupsWithGraphs.push({
            interval: item.interval,
            cases: item.cases,
            graph: undefined,
          });
        }
      });
      return cycleTimeGroupsWithGraphs;
    }
  }
  return cycleTimeGroupsWithGraphs;
}
