import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';
import NodeGeocoder from 'node-geocoder';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: 'AIzaSyALTekTndRtkxrSuLgpPx4R5NloqJRZbBU'
});

function titleCase(str: string) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

export default defineRoutes((app: any) => [
  app.post('/dash/settings/clinic/create', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const { name, address, suburb, zipcode, country, speciality, businessNumber } = await request.json();
    if (!name || !address || !suburb || !zipcode || !country || !speciality || !businessNumber) {
      throw new HttpError(400, "Invalid JSON body, requires {name, address, suburb, zipcode, country, speciality, businessNumber}");
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

    const geocoding = await geocoder.geocode({
      address: address,
      country: country,
      zipcode: zipcode,
    });

    if (!geocoding.length) {
      throw new HttpError(400, 'Invalid address');
    }

    const clinic = await prisma.clinic.create({
      data: {
        name: titleCase(name),
        address: titleCase(address),
        suburb: titleCase(suburb),
        country: titleCase(country),
        latitude: geocoding[0].latitude,
        longitude: geocoding[0].longitude,
        businessNumber: businessNumber,
        speciality,
        ownerId: adminAccount.id,
        approved: false,
        administrators: {
          connect: [
            {
              id: adminAccount.id,
              userId: id,
            }
          ]
        }
      }
    });

    return clinic;
  }),
]);

