import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app) => [
  app.get('/dash/home/table', async (request) => {
    return {map: true};
  }),
]);