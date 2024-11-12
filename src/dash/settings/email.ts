import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from '../..';

const prisma = new PrismaClient();
const email = Router();

email.get('/dash/settings/email', async (req: AuthenticatedRequest, res) => {
  let { id, email } = req.user;
  if (!email) {
    res.status(400).send('Missing JSON body {email}');
    return;
  }
  email = email.toLowerCase();

  res.status(200).send(email);
});

email.post('/dash/settings/email', async (req: AuthenticatedRequest, res) => {
  let { id, email } = req.user;
  let newEmailAddress = req.body.email;

  if (!newEmailAddress) {
    res.status(400).send('Missing JSON body {email}');
    return;
  }
  newEmailAddress = newEmailAddress.toLowerCase();

  try {
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        email: newEmailAddress
      },
    });
    res.status(200).send('Email updated');
    return;
  } catch (err) {
    res.status(400).send('Email already exists');
    return;
  }
});

export default email;