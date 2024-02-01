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

    const owned = await prisma.clinic.findMany({
      where: {
        ownerId: adminAccount?.id
      }
    });

    const joined = await prisma.clinic.findMany({
      where: {
        administrators: {
          some: {
            id: adminAccount?.id
          }
        }
      }
    });

    return { owned, joined };
  }),
]);