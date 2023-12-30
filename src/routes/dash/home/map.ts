import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app) => [
  app.get('/dash/home/map', async (request) => {
    return {map: true};
  }),
]);