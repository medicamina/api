import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/settings/account', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const user = prisma.user.findUnique({
      where: {
        id
      },
      select: {
        firstName: true,
        middleName: true,
        lastName: true,
        dob: true,
        phoneNumber: true,
        gender: true,
        birthCity: true,
        birthState: true,
        birthCountry: true,
      },
    });

    return user;
  }),
]);

