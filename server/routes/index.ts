import { IRouter } from '../../../../src/core/server';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/bpmining/example',
      validate: false,
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          time: new Date().toISOString(),
        },
      });
    }
  );
}
