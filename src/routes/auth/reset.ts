import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app) => [
  app.get('/reset', async (request) => {
    return { reset: "password" };
  }),
  app.post('/reset', async (request) => {
    const body = await request.json();
    return Response.json({ body });
  }),
]);