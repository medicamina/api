import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '..';
import * as nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const login = Router();

const transporter = nodemailer.createTransport({
  host: Bun.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: Bun.env.SMTP_USERNAME,
    pass: Bun.env.SMTP_PASSWORD,
  },
});

login.post('/auth/login', async (req: AuthenticatedRequest, res) => {
  if (req.user) {
    res.status(400).send('Already logged in');
    return;
  }

	let loginEmail = req.body.email;
	let password = req.body.password;
  if (!loginEmail || !password) {
    res.status(400).send('Missing JSON body {email, password}');
    return;
  }
  loginEmail = loginEmail.toLowerCase().trim();
  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: loginEmail,
        registered: true
      },
      select: {
        id: true,
        email: true,
        password: true
      }
    });
  } catch (err) {
    res.status(500).send('error ' + err);
    return;
  }

  if (!user) {
    res.status(400).send('User account not found with email ' + loginEmail);
    return
  }

  if (user && user.password) {
    let isMatch;
    try {
      isMatch = await Bun.password.verify(password, user.password);
    } catch (err) {
      res.status(500).send('error: ' + err);
      return;
    }

    delete (user as { password?: string }).password;

    if (isMatch) {
      const mailOptions = {
        from: Bun.env.SMTP_USERNAME,
        to: loginEmail,
        subject: 'New login',
        text: `Hello ${loginEmail},\n\nYou have logged in to your account.\n\nIf this was not you, please contact us immediately.\n\nBest,\nYour medicamina team`,
      };
  
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            reject(error);
            return;
          }
          resolve(info);
          return;
        });
      })
        .then((info) => {
          res.status(200).send({ auth: jwt.sign(user, Bun.env.JWT_SECRET_TOKEN as string) });
          return;
        })
        .catch((error) => {
          res.status(500).send(`Error sending email: ${error}`);
          return;
        });
    }
  }

  res.status(400).send('Invalid password');
  return;
});
login.get('/auth/login', (req, res) => {
  res.send('Hello World');
});

export default login;
