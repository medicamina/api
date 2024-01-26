import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

function titleCase(str: string) {
 let newStr = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    newStr[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return newStr.join(' ');
}

export default defineRoutes((app: any) => [
  // app.get('/dash/settings/clinic/create', async (request: any) => {
  //   const { id, email } = await request.authenticate();
  //   if (!id || !email) {
  //     throw new HttpError(401, "Unauthenticated");
  //   }

  //   return email;
  // }),
  app.post('/dash/settings/clinic/create', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const { name, address, suburb, country, speciality } = await request.json();
    if (!name || !address || !suburb || !country || !speciality) {
      throw new HttpError(400, "Invalid JSON body, requires {name, address, suburb, country, speciality}");
    }

    let adminAccount = await prisma.administrator.findUnique({
      where: {
        userId: id
      },
    });

    if (!adminAccount) {
      adminAccount = await prisma.administrator.create({
        data: {
          userId: id
        }
      });
    }

    const clinic = await prisma.clinic.create({
      data: {
        name: titleCase(name),
        address: titleCase(address),
        suburb: titleCase(suburb),
        country: titleCase(country),
        speciality,
        ownerId: adminAccount.id,
        administrators: {
          connect: [
            { userId: adminAccount.id }
          ]
        }
      }
    });

    return clinic;
  }),
]);
