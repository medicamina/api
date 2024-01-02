import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/appointment/booking', async (request: any) => {
    return {booking: true};
  }),
  app.post('/dash/appointment/booking/:id', async (request: any) => {
    return {newBooking: true};
  }),
]);