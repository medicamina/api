import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/settings/password', async (request: any) => {
    const { id, email } = await request.authenticate();
    const { password } = await request.json();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    if (!password) {
      throw new HttpError(400, "Invalid JSON body, requires {password}");
    }

    const hashedPassword = await Bun.password.hash(password);

    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        password: hashedPassword
      },
    });

    return user;
  }),
]);

