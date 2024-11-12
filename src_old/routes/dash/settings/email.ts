import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/settings/email', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    return email;
  }),
  app.post('/dash/settings/email', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const { emailAddress } = await request.json();
    if (!emailAddress) {
      throw new HttpError(400, "Invalid JSON body, requires {emailAddress}");
    }

    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        email: emailAddress
      },
    });

    return user;
  }),
]);

