import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/settings/upgrade', async (request: any) => {
    const { id, email } = await request.authenticate();
    const { speciality } = await request.json();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    if (!speciality) {
      throw new HttpError(400, "Missing JSON body {speciality}");
    }

    const doctor = await prisma.doctor.create({
      data: {
        userId: id,
        speciality 
      }
    });

    return doctor;
  }),
]);