import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from '../..';

const doctor = Router();

const prisma = new PrismaClient();

// doctor.post('/dash/appointment/doctor/:clinicId', async (req: AuthenticatedRequest, res) => {

// });

doctor.post('/dash/appointment/doctor/:clinicId', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }

  const clinicId = req.params.clinicId;
  console.log(clinicId);

  async function getDoctorAppointments(clinicId: string) {
    const clinic = await prisma.clinic.findUnique({
      where: {
        id: clinicId,
        approved: true
      },
      include: {
        hours: true,
        doctors: true
      }
    }).catch((error: string | undefined) => {
      res.status(500).send('Internal server error');
      return;
    });

    if (clinic) {
      clinic['joinCode'] = null;
    }
    return clinic;
  }

  res.status(200).send(await getDoctorAppointments(clinicId));
  return;
});

export default doctor;