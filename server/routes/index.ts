import { IRouter } from '../../../../src/core/server';
import { aggregatedProcessGraphRoute } from './agg_process_graph_route';
import { aggregatedThirdPartyGraphRoute } from './agg_third_party_graph_route';
import { caseProcessGraphRoute } from './case_process_graph_route';
import { caseThirdPartyGraphRoute } from './case_third_party_graph_route';
import { processGraphCycleTimesRoute } from './process_graph_cycle_times_route';

export function defineRoutes(router: IRouter) {
  aggregatedProcessGraphRoute(router);
  aggregatedThirdPartyGraphRoute(router);
  caseProcessGraphRoute(router);
  caseThirdPartyGraphRoute(router);
  processGraphCycleTimesRoute(router);
}
