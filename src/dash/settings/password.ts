import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from '../..';

const prisma = new PrismaClient();
const password = Router();

password.post('/dash/settings/password', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  const password = req.body.password;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }
  if (!password) {
    res.status(400).send('Missing JSON body {password}');
    return;
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

  res.status(200).send('Password updated');
  return;
});

export default password;