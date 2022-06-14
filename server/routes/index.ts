import { IRouter } from '../../../../src/core/server';
import { aggregatedProcessGraphRoute } from './agg_process_graph_route';
import { aggregatedThirdPartyGraphRoute } from './agg_third_party_graph';

export function defineRoutes(router: IRouter) {
  aggregatedProcessGraphRoute(router);
  aggregatedThirdPartyGraphRoute(router);
}
