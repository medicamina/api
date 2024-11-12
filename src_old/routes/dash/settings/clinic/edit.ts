import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/settings/clinic/edit/post', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const {
      clinicId,
      sundayOpen,
      sundayClose,
      sundayOperating,
      mondayOpen,
      mondayClose,
      mondayOperating,
      tuesdayOpen,
      tuesdayClose,
      tuesdayOperating,
      wednesdayOpen,
      wednesdayClose,
      wednesdayOperating,
      thursdayOpen,
      thursdayClose,
      thursdayOperating,
      fridayOpen,
      fridayClose,
      fridayOperating,
      saturdayOpen,
      saturdayClose,
      saturdayOperating,
    } = await request.json();

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

    let businessHours = await prisma.businessHour.findUnique({
      where: {
        clinicId: clinicId,
        isClinic: true,
      }
    });

    if (!businessHours) {
      businessHours = await prisma.businessHour.create({
        data: {
          clinic: {
            connect: {
              id: clinicId
            }
          },
          isClinic: true,
          sundayOpen,
          sundayClose,
          sundayOperating,
          mondayOpen,
          mondayClose,
          mondayOperating,
          tuesdayOpen,
          tuesdayClose,
          tuesdayOperating,
          wednesdayOpen,
          wednesdayClose,
          wednesdayOperating,
          thursdayOpen,
          thursdayClose,
          thursdayOperating,
          fridayOpen,
          fridayClose,
          fridayOperating,
          saturdayOpen,
          saturdayClose,
          saturdayOperating,
        }
      });
    } else {
      businessHours = await prisma.businessHour.update({
        where: {
          clinicId,
          isClinic: true
        },
        data: {
          sundayOpen,
          sundayClose,
          sundayOperating,
          mondayOpen,
          mondayClose,
          mondayOperating,
          tuesdayOpen,
          tuesdayClose,
          tuesdayOperating,
          wednesdayOpen,
          wednesdayClose,
          wednesdayOperating,
          thursdayOpen,
          thursdayClose,
          thursdayOperating,
          fridayOpen,
          fridayClose,
          fridayOperating,
          saturdayOpen,
          saturdayClose,
          saturdayOperating,
        }
      })
    }

    return businessHours;
  }),
  app.post('/dash/settings/clinic/edit/get', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const { clinicId } = await request.json();

    const hours = await prisma.businessHour.findUnique({
      where: {
        clinicId: clinicId,
        isClinic: true
      }
    });

    return hours;
  })
]);