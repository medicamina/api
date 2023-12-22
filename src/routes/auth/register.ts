import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const { defineRoutes } = createApplication();

export default defineRoutes((app) => [
  app.post('/auth/register', async (request) => { 
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      throw new HttpError(400, "Missing JSON body {name, email, password}");
    }
    if (email.length > 100) {
      throw new HttpError(400, "Email too long")
    }
    if (password.length < 6) {
      throw new HttpError(400, "Password too short");
    }

    const validateEmail = (email: string) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (validateEmail(email)) {
      const hashedPassword = await Bun.password.hash(password);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        },
      });
  
      return { auth: jwt.sign(user, Bun.env.JWT_SECRET_TOKEN as string) };
    }
    
    throw new HttpError(400, "Invalid email");
  }),
]);
