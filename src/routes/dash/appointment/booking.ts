import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.post('/dash/appointmnet/booking/:bookingId/cancel', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const bookingId = request.params.bookingId;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId
      }
    });

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (booking.patientId !== id) {
      throw new HttpError(403, "Unauthorized");
    }

    if (booking.cancelled) {
      throw new HttpError(400, "Booking already cancelled");
    }

    const cancelledBooking = await prisma.booking.update({
      where: {
        id: bookingId
      },
      data: {
        cancelled: true
      }
    });

    return cancelledBooking
  }),
  app.get('/dash/appointment/booking', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
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

    return bookings;
  }),
  app.post('/dash/appointment/booking', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const { longitude, latitude } : { longitude: number, latitude: number } = await request.json();

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

    return findNearestClinic(latitude, longitude)
      .then(async (clinics: any) =>{
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
        return clinics;
      })
      .catch(error => {
        throw new HttpError(500, error);
      });
  }),
  app.get('/dash/appointment/booking/:clinicId/:doctorId', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const clinicId = request.params.clinicId;
    const doctorId = request.params.doctorId;

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
        throw new HttpError(500, error);
      });

      return doctor;
    }

    return await getDoctorAppointments(doctorId);
    
  }),
  app.post('/dash/appointment/booking/:clinicId/:doctorId', async (request: any) => {
    const { id, email } = await request.authenticate();
    if (!id || !email) {
      throw new HttpError(401, "Unauthenticated");
    }

    const clinicId = request.params.clinicId;
    const doctorId = request.params.doctorId;
    
    const { time } = await request.json();

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

    return booking;
  }),
]);