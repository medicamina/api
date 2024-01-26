import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/settings/personal', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        firstName: true,
        middleName: true,
        lastName: true,
        dob: true,
        gender: true,
        birthCity: true,
        birthState: true,
        birthCountry: true,
      },
    });

    return user;
  }),
  app.post('/dash/settings/personal', async (request: any) => {
    const { id, email } = await request.authenticate();
    const { firstName, middleName, lastName, dob, phoneNumber, gender, birthCity, birthState, birthCountry } = await request.json();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    if (!firstName || !lastName || !dob || !phoneNumber || !gender || !birthCountry || !birthState || !birthCity) {
      throw new HttpError(400, "Invalid JSON body, requires {firstName, lastName, dob, phoneNumber, gender, birthCountry, birthState, birthCity}");
    }

    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        firstName: firstName || undefined,
        middleName: middleName,
        lastName: lastName || undefined,
        dob: new Date(dob).toISOString() || undefined,
        gender: gender || undefined,
        birthCity: birthCity || undefined,
        birthState: birthState || undefined,
        birthCountry: birthCountry || undefined
      },
    });

    return user;
  }),
]);

