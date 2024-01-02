import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/home/map', async (request: any) => {
    return {map: true};
  }),
]);