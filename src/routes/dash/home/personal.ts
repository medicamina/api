import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function(txt: string) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    }
  );
}

export default defineRoutes((app: any) => [
  app.post('/dash/home/personal', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }
    let { firstName, middleName, lastName, dob, height, weight, gender, birthCountry, birthState, birthCity } = await request.json();

    if (!firstName || !lastName || !dob || !height || !weight || !gender || !birthCountry || !birthState || !birthCity) {
      throw new HttpError(400, "Invalid JSON body, requires {firstName, lastName, dob, height, weight, gender, birthCountry, birthState, birthCity}");
    }

    firstName = toTitleCase(firstName);
    if (middleName) {
      middleName = toTitleCase(middleName);
    }
    lastName = toTitleCase(lastName);
    birthCity = toTitleCase(birthCity);
    birthState = toTitleCase(birthState);
    birthCountry = toTitleCase(birthCountry);
    gender = gender.toUpperCase();

    const user = await prisma.user.update({
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
        gender,
        birthCity,
        birthState,
        birthCountry,
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

    const user = await prisma.user.findUnique({
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