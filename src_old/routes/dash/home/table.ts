import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/home/table', async (request: any) => {
    return {map: true};
  }),
]);