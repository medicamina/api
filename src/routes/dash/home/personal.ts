import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/home/personal', async (request: any) => {
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
        lastName: true,
        dob: true,
        bloodType: true,
        height: true,
        weight: true,
        gender: true
      }
    });

    return user;
  }),
]);