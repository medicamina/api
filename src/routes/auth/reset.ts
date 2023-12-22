import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app) => [
  app.post('/auth/reset', async (request) => {
    const user = await request.authenticate();
    return Response.json(user);
  }),
]);