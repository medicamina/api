import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from '../..';

const prisma = new PrismaClient();
const settingsPersonal = Router();

settingsPersonal.get('/dash/settings/personal', async (req: AuthenticatedRequest, res) => {
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
      firstName: true,
      middleName: true,
      lastName: true,
      dob: true,
      gender: true,
      birthCity: true,
      birthState: true,
      birthCountry: true,
    },
  });

  res.status(200).send(user);
});

settingsPersonal.post('/dash/settings/personal', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }
  const { firstName, middleName, lastName, dob, gender, birthCity, birthState, birthCountry } = await req.body;
  if (!firstName || !lastName || !dob || !gender || !birthCountry || !birthState || !birthCity) {
    res.status(400).send('Invalid JSON body, requires {firstName, lastName, dob, gender, birthCountry, birthState, birthCity}');
  }

  try {
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        firstName: firstName || undefined,
        middleName: middleName,
        lastName: lastName || undefined,
        dob: new Date(dob).toISOString() || undefined,
        gender: gender || undefined,
        birthCity: birthCity || undefined,
        birthState: birthState || undefined,
        birthCountry: birthCountry || undefined
      },
    });
    res.status(200).send('User updated');
    return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
});

export default settingsPersonal;