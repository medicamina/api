import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/settings/clinic', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const adminAccount = await prisma.administrator.findUnique({
      where: {
        userId: id
      }
    });

    const pending = await prisma.clinic.findMany({
      where: {
        ownerId: adminAccount?.id,
        approved: false,
      },
      select: {
        id: true,
        businessNumber: true,
        longitude: true,
        latitude: true,
        address: true,
        suburb: true,
        country: true,
        joinCode: false,
        name: true,
        speciality: true,
        ownerId: true,
        approved: true,
        approvedAt: true,
        pictureUrl: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    const owned = await prisma.clinic.findMany({
      where: {
        ownerId: adminAccount?.id,
        approved: true
      }
    });

    const joined = await prisma.clinic.findMany({
      where: {
        approved: true,
        administrators: {
          some: {
            id: adminAccount?.id
          }
        }
      }
    });

    return { pending, owned, joined };
  }),
]);