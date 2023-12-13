import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app) => [
    // app.get('/', async (request) => { return { hello: "hi" } }),
    app.get('/foo', async (request) => { return { hello: "world" }}),
  ]);