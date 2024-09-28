import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  // app.post('/dash/appointment/booking/:doctorId', async (request: any) => { 

  // }),
  app.post('/dash/appointment/doctor/:clinicId', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const clinicId = request.params.clinicId;
    console.log(clinicId);

    async function getDoctorAppointments(clinicId: string) {
      const clinic = await prisma.clinic.findUnique({
        where: {
          id: clinicId,
          approved: true
        },
        include: {
          hours: true,
          doctors: true
        }
      }).catch((error: string | undefined) => {
        throw new HttpError(500, error);
      });

      if (clinic) {
        clinic['joinCode'] = null;
      }
      return clinic;
    }

    return await getDoctorAppointments(clinicId);
  }),
  app.post('/dash/appointment/doctor/:id', async (request: any) => {
    return { newBooking: true };
  }),
]);