import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/settings/physician/create', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const { name, speciality } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    });

    const physicianAccount = await prisma.doctor.create({
      data: {
        name: "Dr. " + user?.firstName + " " + user?.lastName,
        speciality: speciality,
        user: { connect: { id: id, }, },
      },
    });

    return physicianAccount;
  }),
  app.post('/dash/settings/physician/get', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    let physicianAccount = await prisma.doctor.findUnique({
      where: {
        userId: id,
        approved: true
      },
      include: {
        clinics: {
          include: {
            hours: true
          }
        }
      }
    });

    const pending = await prisma.doctor.findMany({
      where: {
        userId: id,
        approved: false,
      }
    });

    return { physicianAccount, pending };
  }),
]);