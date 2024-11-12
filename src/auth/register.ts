import { PrismaClient } from "@prisma/client";
import { Router } from 'express';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from "..";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: Bun.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: Bun.env.SMTP_USERNAME,
    pass: Bun.env.SMTP_PASSWORD,
  },
});
const register = Router();

register.post('/auth/register', async (req: AuthenticatedRequest, res) => {
  let { id, email } = req.user;
  if (id || email) {
    res.status(400).send('Already logged in');
    return;
  }
  let registrationEmail = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;

  if (!registrationEmail || !password) {
    res.status(400).send('Missing JSON body {email, password}');
    return;
  }
  if (registrationEmail.length < 8) {
    res.status(400).send('Email too short');
    return;
  }
  if (registrationEmail.length > 100) {
    res.status(400).send('Email too long');
    return;
  }
  if (password.length < 6) {
    res.status(400).send('Password too short');
    return;
  }
  if (password.length > 100) {
    res.status(400).send('Password too long');
    return;
  }

  registrationEmail = registrationEmail.toLowerCase();

  const validateEmail = (registrationEmail: string) => {
    return String(registrationEmail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  if (!validateEmail(registrationEmail)) {
    res.status(400).send('Invalid email');
    return;
  } else {
    const hashedPassword = await Bun.password.hash(password);

    let user = await prisma.user.create({
      data: {
        email: registrationEmail,
        password: hashedPassword,
        phoneNumber: phoneNumber || undefined
      },
      select: {
        id: true,
        email: true,
        password: true
      }
    });

    const mailOptions = {
      from: Bun.env.SMTP_USERNAME,
      to: registrationEmail,
      subject: 'Welcome to medicamina',
      text: `Thanks for signing up`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error); // Reject the promise with the error
          return;
        }
        resolve(info); // Resolve the promise with the info object
      });
    })
      .then((info) => {
        res.status(200).send({ auth: jwt.sign(user, Bun.env.JWT_SECRET_TOKEN as string), info: info });
      })
      .catch((error) => {
        res.status(500).send(`Error sending email: ${error}`);
      });
  }
});
register.get('/auth/register', (req, res) => {
  res.send('Hello World');
});

export default register;
