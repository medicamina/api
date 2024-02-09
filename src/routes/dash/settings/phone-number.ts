import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/settings/phone-number', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        phoneNumber: true,
      },
    });

    return user;
  }),
  app.post('/dash/settings/phone-number', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }
    
    const { phoneNumber } = await request.json();
    if (!phoneNumber) {
      throw new HttpError(400, "Invalid JSON body, requires {phoneNumber}");
    }

    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        phoneNumber
      },
    });

    return user;
  }),
]);

