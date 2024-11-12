import { PrismaClient } from "@prisma/client";
import { Router } from 'express';
import * as nodemailer from 'nodemailer';
import { AuthenticatedRequest } from "..";

const prisma = new PrismaClient();
const reset = Router();

const transporter = nodemailer.createTransport({
  host: Bun.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: Bun.env.SMTP_USERNAME,
    pass: Bun.env.SMTP_PASSWORD,
  },
});

// reset.get('/auth/reset/:token', async (req, res) => { });

reset.post('/auth/reset', async (req: AuthenticatedRequest, res) => {
  let email = req.body.email;
  if (!email) {
    res.status(400).send('Email is required');
    return;
  }
  email = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

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
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error); // Reject the promise with the error
          return;
        }
        resolve(info); // Resolve the promise with the info object
      });
    }).then((info) => {
      res.status(200).send('Please check your e-mail for password reset instructions');
    }).catch((error) => {
      res.status(500).send(`Error sending email: ${error}`);
    });
  }
});

export default reset;