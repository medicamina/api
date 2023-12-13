import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const { defineRoutes } = createApplication();

export default defineRoutes((app) => [
  app.post('/register', async (request) => { 
    const body = await request.json();
    if (!body || !body.name || !body.email) {
      throw new HttpError(500, "missing JSON object {name, email}");
    }

    const user = await prisma.user.create({
      data: {
        name: `${body.name}`,
        email: `${body.email}-${Math.random()}@example.com`,
      },
    });

    return user; 
  }),
]);
