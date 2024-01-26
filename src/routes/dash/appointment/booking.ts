import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/appointment/booking', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const clinics = await prisma.clinic.findMany({
      take: 10,
      include: {
        hours: true,
        doctors: true
      }
    });

    return clinics;
  }),
  app.post('/dash/appointment/booking/:id', async (request: any) => {
    return {newBooking: true};
  }),
]);