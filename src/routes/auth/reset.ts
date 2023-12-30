import { HttpError, createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app) => [
  app.post('/auth/reset', async (request) => {
    const { email } = await request.json();
    if (!email) {
      throw new HttpError(400, "Missing JSON body {email}");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const resetToken = crypto.randomUUID();
      const updateUser = await prisma.user.update({
        where: {
          email,
        },
        data: {
          resetToken,
        },
      });
      /// TODO: Send Email
      return { status: 200, msg: 'Check your email' };
    }

    throw new HttpError(400, "Invalid email");
  }),
]);