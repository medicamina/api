import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/settings/physician/clinic/leave', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const { clinicId } = await request.json();

    let doctor = await prisma.doctor.findUnique({
      where: {
        userId: id
      }
    });

    if (!doctor) {
      throw new HttpError(403, "You are not a doctor of this clinic");
    }

    return await prisma.$transaction(async (tx) => {
      await tx.clinic.update({
        where: {
          id: clinicId,
        },
        data: {
          doctors: {
            disconnect: [
              { id: doctor?.id }
            ]
          }
        }
      });
      await tx.businessHour.deleteMany({
        where: {
          doctorId: doctor?.id,
          clinicId: clinicId,
          isClinic: false
        }
      });
    });

  }),
]);