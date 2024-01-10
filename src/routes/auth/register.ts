import { HttpError, createApplication } from '@nbit/bun';
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';
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

export default defineRoutes((app: { post: (arg0: string, arg1: (request: any) => Promise<never>) => any; }) => [
  app.post('/auth/register', async (request) => { 
    let { email, password } = await request.json();
    if (!email || !password) {
      throw new HttpError(400, "Missing JSON body {email, password}");
    }
    if (email.length < 8) {
      throw new HttpError(400, "Email too short")
    }
    if (email.length > 100) {
      throw new HttpError(400, "Email too long")
    }
    if (password.length < 6) {
      throw new HttpError(400, "Password too short");
    }
    if (password.length > 100) {
      throw new HttpError(400, "Password too long");
    }

    email = eamil.toLowerCase();

    const validateEmail = (email: string) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (!validateEmail(email)) {
      throw new HttpError(400, "Invalid email");
    } else {
      const hashedPassword = await Bun.password.hash(password);

      try {
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword
          },
          select: {
            id: true,
            email: true,
            password: true
          }
        });
      } catch (err) {
        throw new HttpError(400, 'Email is already in use');
      }

      const mailOptions = {
        from: 'admin@medicamina.us',
        to: email,
        subject: 'Welcome to medicamina',
        text: `Thanks for signing up`,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          throw new HttpError(500, error);
        }
        return { auth: jwt.sign(user, Bun.env.JWT_SECRET_TOKEN as string) };
      });
    }
  }),
]);
