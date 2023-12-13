import { createApplication } from '@nbit/bun';

const { attachRoutes } = createApplication();

import * as handlers from './routes';

Bun.serve({
  port: 3000,
  fetch: attachRoutes(...Object.values(handlers)),
});

console.log('server running http://localhost:3000/');