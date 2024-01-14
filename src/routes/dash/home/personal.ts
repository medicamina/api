import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/home/personal', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }
    const { firstName, middleName, lastName, dob, height, weight, gender } = await request.json();

    if (!firstName || !lastName || !dob || !height || !weight || !gender) {
      throw new HttpError(400, "Invalid JSON body, requires {firstName, middleName, lastName, dob, height, weight, gender}");
    }

    const user = prisma.user.update({
      where: {
        id
      },
      data: {
        firstName,
        middleName,
        lastName,
        dob: new Date(dob).toISOString(),
        height: Number.parseFloat(height),
        weight: Number.parseFloat(weight),
        gender
      },
      select: {
        id: true,
        email: true
      }
    });

    return user;
  }),
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
        middleName: true,
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