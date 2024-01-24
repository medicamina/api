import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/auth/login', async (request: any) => {
    let { email, password } = await request.json();
    if (!email || !password) {
      throw new HttpError(400, "Missing JSON body {email, password}");
    }

    email = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true
      }
    });

    if (user && user.password) {
      const isMatch = await Bun.password.verify(password, user.password);

      if (isMatch) {
        return Response.json({ auth: jwt.sign(user, Bun.env.JWT_SECRET_TOKEN as string) }, {
          headers: {
            "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }   
    }

    throw new HttpError(400, "Invalid login credentials");
  }),
]);