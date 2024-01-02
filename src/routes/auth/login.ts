import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/auth/login', async (request: any) => {
    const { email, password } = await request.json();
    if (!email || !password) {
      throw new HttpError(400, "Missing JSON body {email, password}");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && user.password) {
      const isMatch = await Bun.password.verify(password, user.password);

      if (isMatch) {
        return { auth: jwt.sign(user, Bun.env.JWT_SECRET_TOKEN as string) };
      }   
    }

    throw new HttpError(400, "Invalid login credentials");
  }),
]);