import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/settings/clinic/leave', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const { clinicId } = await request.json();

    let adminAccount = await prisma.administrator.findUnique({
      where: {
        userId: id
      }
    });

    if (!adminAccount) {
      throw new HttpError(403, "You are not an administrator of this clinic");
    }

    try {
      return await prisma.clinic.update({
        where: {
          id: clinicId,
          ownerId: {
            not: id
          }
        },
        data: {
          administrators: {
            disconnect: [
              { id: adminAccount.id }
            ]
          }
        }
      });
    } catch (err) {
      throw new HttpError(403, "You can not leave this clinic as it's owner, please delete the clinic instead");
    }

  }),
]);