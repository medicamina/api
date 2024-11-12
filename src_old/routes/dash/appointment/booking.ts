import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from '../../..';

const prisma = new PrismaClient();
const booking = Router();

booking.post('/dash/appointmnet/booking/:bookingId/cancel', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }
  const bookingId = req.params.bookingId;
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      patientId: id,
    }
  });
  if (!booking) {
    res.status(404).send('Booking not found');
    return;
  }
  if (booking.patientId !== id) {
    res.status(403).send('Unauthorized');
    return;
  }
  if (booking.cancelled) {
    res.status(400).send('Booking already cancelled');
    return;
  }

  const cancelledBooking = await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      cancelled: true,
      cancelledAt: Date().toString(),
    }
  });

  return res.status(200).send('Booking cancelled');
});

booking.get('/dash/appointment/booking', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }
  const bookings = await prisma.booking.findMany({
    where: {
      patientId: id,
      time: {
        gte: new Date() // Filters bookings newer than or on the current date
      },
      cancelled: false,
    },
    include: {
      clinic: true,
      doctor: true
    }
  });

  for (const booking of bookings) {
    booking.clinic.joinCode = null;
  }

  res.status(200).json(bookings);
  return;
});

booking.post('/dash/appointment/booking', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }
  const { longitude, latitude }: { longitude: number, latitude: number } = req.body;

  async function findNearestClinic(latitude: number, longitude: number) {
    const clinics = await prisma.$queryRaw`
        WITH Distances AS (
          SELECT 
            id,
            latitude,
            longitude,
            approved,
            (
              6371 *
              acos(
                cos(radians(${latitude})) *
                cos(radians(latitude)) *
                cos(radians(longitude) - radians(${longitude})) +
                sin(radians(${latitude})) *
                sin(radians(latitude))
              )
            ) AS distance
          FROM 
            "Clinic"
        )
        SELECT 
          id,
          latitude,
          longitude,
          distance
        FROM 
          Distances
        WHERE 
          distance < 25
        AND
          approved = true
        ORDER BY 
          distance
        LIMIT 20 OFFSET 0;
      `;

    return clinics;
  }

  findNearestClinic(latitude, longitude)
    .then(async (clinics: any) => {
      for (var clinic in clinics) {
        clinics[clinic]['clinic'] = await prisma.clinic.findUnique({
          where: {
            id: clinics[clinic].id,
            approved: true
          },
          include: {
            hours: true,
            doctors: true
          }
        });
        if (clinics[clinic]['clinic'] == null) {
          clinics.splice(clinic, 1);
        }
      }
      res.status(200).json(clinics);
    })
    .catch((error) => {
      res.status(500).send('Internal server error');
    });
});

booking.get('/dash/appointment/booking/:clinicId/:doctorId', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }

  const clinicId = req.params.clinicId;
  const doctorId = req.params.doctorId;

  async function getDoctorAppointments(doctorId: string) {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId
      },
      include: {
        hours: true,
        bookings: true
      }
    }).catch((error: string | undefined) => {
      res.status(500).send('Internal server error');
      return;
    });

    return doctor;
  }

  const doctor = await getDoctorAppointments(doctorId);
  res.status(200).json(doctor);
  return;
});

booking.post('/dash/appointment/booking/:clinicId/:doctorId', async (req: AuthenticatedRequest, res) => {
  const { id, email } = req.user;
  if (!id || !email) {
    res.status(401).send('Unauthenticated');
    return;
  }

  const clinicId = req.params.clinicId;
  const doctorId = req.params.doctorId;

  const { time } = req.body;

  try {
    const booking = await prisma.booking.create({
      data: {
        clinic: { connect: { id: clinicId } },
        doctor: { connect: { id: doctorId } },
        patient: { connect: { id } },
        time: new Date(time).toISOString(),
        approvedAt: undefined,
        approvedBy: undefined,
      }
    });  
  } catch (err) {
    res.status(500).send('Internal server error');
    return;
  }
  res.status(200).json(booking);
  return;
});