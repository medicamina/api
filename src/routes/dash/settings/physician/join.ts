import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/settings/physician/join', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const {
      joinCode,
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

    const physicianAccount = await prisma.doctor.findUnique({
      where: {
        userId: id,
      }
    });


    return await prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.update({
        where: {
          joinCode: joinCode
        },
        data: {
          doctors: {
            connect: {
              id: physicianAccount?.id
            }
          }
        }
      });
      await tx.businessHour.create({
        data: {
          clinic: {
            connect: {
              id: clinic.id
            }
          },
          doctor: {
            connect: {
              id: physicianAccount?.id
            }
          },
          isClinic: false,
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
          consultLength: 15,
        }
      });
    });
  }),
]);