import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const { attachRoutes } = createApplication({
  getContext: (request: any) => ({
    authenticate: async () => {
      const authToken = request.headers.get('Authorization') ?? ''
      const sessionToken: any = jwt.verify(authToken, Bun.env.JWT_SECRET_TOKEN as string);
      if (sessionToken) {
        const user = await prisma.user.findUnique({
          where: {
            id: sessionToken.id,
          },
          select: {
            id: true,
            email: true,
          }
        });
        if (user) {
          const id = user.id;
          const email = user.email;
          return { id, email };
        }
        throw new HttpError(404, "User account not found");
      }
      throw new HttpError(401, "User not authenticated");
    }
  }),
});

import * as handlers from './routes';

Bun.serve({
  port: Bun.env.SERVER_PORT,
  fetch: attachRoutes(...Object.values(handlers)),
});

console.log(`server running http://localhost:${Bun.env.SERVER_PORT}/`);