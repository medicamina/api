import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';
import NodeGeocoder from 'node-geocoder';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: Bun.env.GOOGLE_MAP_API_KEY
});

function titleCase(str: string) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

export default defineRoutes((app: any) => [
  app.post('/dash/settings/clinic/create', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const {
      name,
      address,
      suburb,
      zipcode,
      country,
      speciality,
      businessNumber,
      sundayOpen,
      sundayClose,
      mondayOpen,
      mondayClose,
      tuesdayOpen,
      tuesdayClose,
      wednesdayOpen,
      wednesdayClose,
      thursdayOpen,
      thursdayClose,
      fridayOpen,
      fridayClose,
      saturdayOpen,
      saturdayClose,
    } = await request.json();

    const geocoding = await geocoder.geocode({
      address: address,
      country: country,
      zipcode: zipcode,
    });

    if (!geocoding.length) {
      throw new HttpError(400, 'Invalid street address');
    }

    return await prisma.$transaction(async (tx) => {
      let adminAccount = await tx.administrator.findUnique({
        where: {
          userId: id
        },
      });

      if (!adminAccount) {
        adminAccount = await tx.administrator.create({
          data: {
            userId: id
          }
        });
      }

      const clinic: any = await tx.clinic.create({
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
        },
      });

      // Check sundayClose date is after sundayOpen date
      if (Date.parse(sundayOpen) < Date.parse(sundayClose)) {
        throw new HttpError(400, 'Sunday close time must be after open time');
      }

      // Check mondayClose date is after mondayOpen date
      if (Date.parse(mondayOpen) < Date.parse(mondayClose)) {
        throw new HttpError(400, 'Monday close time must be after open time');
      }

      // Check tuesdayClose date is after tuesdayOpen date
      if (Date.parse(tuesdayOpen) < Date.parse(tuesdayClose)) {
        throw new HttpError(400, 'Tuesday close time must be after open time');
      }

      // Check wednesdayClose date is after wednesdayOpen date
      if (Date.parse(wednesdayOpen) < Date.parse(wednesdayClose)) {
        throw new HttpError(400, 'Wednesday close time must be after open time');
      }

      // Check thursdayClose date is after thursdayOpen date
      if (Date.parse(thursdayOpen) < Date.parse(thursdayClose)) {
        throw new HttpError(400, 'Thursday close time must be after open time');
      }

      // Check fridayClose date is after fridayOpen date
      if (Date.parse(fridayOpen) < Date.parse(fridayClose)) {
        throw new HttpError(400, 'Friday close time must be after open time');
      }

      // Check saturdayClose date is after saturdayOpen date
      if (Date.parse(saturdayOpen) < Date.parse(saturdayClose)) {
        throw new HttpError(400, 'Saturday close time must be after open time');
      }

      clinic['hours'] = await tx.businessHour.create({
        data: {
          clinic: {
            connect: {
              id: clinic.id
            }
          },
          isClinic: true,
          sundayOpen,
          sundayClose,
          sundayOperating: false,
          mondayOpen,
          mondayClose,
          mondayOperating: true,
          tuesdayOpen,
          tuesdayClose,
          tuesdayOperating: true,
          wednesdayOpen,
          wednesdayClose,
          wednesdayOperating: true,
          thursdayOpen,
          thursdayClose,
          thursdayOperating: true,
          fridayOpen,
          fridayClose,
          fridayOperating: true,
          saturdayOpen,
          saturdayClose,
          saturdayOperating: false,
        }
      });

      return clinic;
    });
  }),
]);

