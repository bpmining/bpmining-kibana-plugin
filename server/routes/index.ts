import { IRouter } from '../../../../src/core/server';
import { registerServerSearchRoute } from './server_search_route';

export function defineRoutes(router: IRouter) {
  registerServerSearchRoute(router);
}
