import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app) => [
  app.get('/dash/appointment/booking', async (request) => {
    return {booking: true};
  }),
  app.post('/dash/appointment/booking/:id', async (request) => {
    return {newBooking: true};
  }),
]);