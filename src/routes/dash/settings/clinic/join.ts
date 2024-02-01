import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/settings/clinic/join', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }
    
    const { joinCode } = await request.json();

    let adminAccount = await prisma.administrator.findUnique({
      where: {
        userId: id
      }
    });

    if (!adminAccount) {
      adminAccount = await prisma.administrator.create({
        data: {
          userId: id
        }
      });
    }

    const clinic = await prisma.clinic.update({
      where: {
        joinCode
      },
      data: {
        administrators: {
          connect: [
            { id: adminAccount.id }
          ]
        }
      }
    });

    return { clinic };
  }),
]);