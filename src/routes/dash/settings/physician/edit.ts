import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/settings/physician/clinic/edit', async (request: any) => {
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
      consultLength,
      callToBook
    } = await request.json();

    let doctor = await prisma.doctor.findUnique({
      where: {
        userId: id
      }
    });

    if (!doctor) {
      throw new HttpError(403, "You are not a doctor of this clinic");
    }

    return await prisma.businessHour.update({
      where: {
        clinicId: clinicId,
        doctorId: doctor?.id,
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
        consultLength,
        callToBook
      }
    });

  }),
]);
