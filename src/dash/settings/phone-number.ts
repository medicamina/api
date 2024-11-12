import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from '../..';

const prisma = new PrismaClient();
const phoneNumber = Router();

phoneNumber.get('/dash/settings/phone-number', async (req: AuthenticatedRequest, res) => {  
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      phoneNumber: true,
    },
  });

  res.status(200).send(user);
  return;
});

phoneNumber.post('/dash/settings/phone-number', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }
  
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    res.status(400).send('Invalid JSON body, requires {phoneNumber}');
    return;
  }

  const user = await prisma.user.update({
    where: {
      id
    },
    data: {
      phoneNumber
    },
  });

  res.status(200).send('Phone number updated');
  return;
});

export default phoneNumber;
