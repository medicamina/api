import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/settings/clinic/delete', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const { clinicId } = await request.json();
    if (!clinicId) {
      throw new HttpError(400, "Invalid JSON body, requires {clinicId}");
    }

    let adminAccount = await prisma.administrator.findUnique({
      where: {
        userId: id
      },
    });

    if (!adminAccount) {
      throw new HttpError(500, "Administrator account not found");
    }

    await prisma.businessHour.deleteMany({
      where: {
        clinicId: clinicId,
      },
    });

    const clinic = await prisma.clinic.delete({
      where: {
        id: clinicId,
        ownerId: adminAccount.id
      }
    });

    return clinic;
  }),
]);

