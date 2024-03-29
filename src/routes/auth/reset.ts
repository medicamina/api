import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";
import * as nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const { defineRoutes } = createApplication();

const transporter = nodemailer.createTransport({
  host: Bun.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: Bun.env.SMTP_USERNAME,
    pass: Bun.env.SMTP_PASSWORD,
  },
});

export default defineRoutes((app: any) => [
  app.post('/auth/reset', async (request: any) => {
    let { email } = await request.json();
    if (!email) {
      throw new HttpError(400, "Missing JSON body {email}");
    }

    email = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true
      }
    });

    if (!user) {
      throw new HttpError(400, "Invalid email address");
    }

    if (user) {
      const resetToken = crypto.randomUUID();
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          resetToken,
        },
      });

      const mailOptions = {
        from: 'admin@medicamina.us',
        to: email,
        subject: 'Medicamina password reset',
        text: `https://medicamina.us/auth/reset/${resetToken}`,
        html: `<a href="https://medicamina.us/auth/reset/${resetToken}">Click here to reset password</a>`
      };

      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve('Please check your email');
          }
        });
      });
    }
  }),
]);