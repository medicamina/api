import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from '../..';

const prisma = new PrismaClient();
const homePersonal = Router();

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function (txt: string) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    }
  );
}

homePersonal.post('/dash/home/personal', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }
  let { firstName, middleName, lastName, dob, height, weight, gender, birthCountry, birthState, birthCity } = req.body;
  
  firstName = toTitleCase(firstName);
  if (middleName) {
    middleName = toTitleCase(middleName);
  }
  lastName = toTitleCase(lastName);
  birthCity = toTitleCase(birthCity);
  birthState = toTitleCase(birthState);
  birthCountry = toTitleCase(birthCountry);
  gender = gender.toUpperCase();

  try {
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        firstName,
        middleName,
        lastName,
        dob: new Date(dob).toISOString(),
        height: Number.parseFloat(height),
        weight: Number.parseFloat(weight),
        gender,
        birthCity,
        birthState,
        birthCountry,
      },
      select: {
        id: true,
        email: true
      }
    });
  } catch (err: any) {
    if (err.code === 'P2002') { 
      res.status(500).send('Account for this user already exists');
      return;
    }

    res.status(500).send('Error updating user: ' + err);
    return;
  }

  res.status(200).send('User updated');
  return;
});

homePersonal.get('/dash/home/personal', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }
  
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        firstName: true,
        middleName: true,
        lastName: true,
        dob: true,
        bloodType: true,
        height: true,
        weight: true,
        gender: true,
      }
    });
  } catch (err) {
    res.status(500).send('Error fetching user: ' + err);
    return;
  }

  res.status(200).send(user);
  return;
});

export default homePersonal;