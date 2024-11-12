import express from 'express';
import path from 'path';
import cors from 'cors';
import * as jwt from 'jsonwebtoken';

const app = express();
app.use(express.static(path.join(import.meta.dir, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(authenticateToken);

export interface AuthenticatedRequest extends express.Request {
  user?: any;
}

function authenticateToken(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction): void {
  const token = req.headers['authorization'];
  
  jwt.verify(token as string, Bun.env.JWT_SECRET_TOKEN as string, (err, user) => {
    if (err) {
      req.user = null;
      next();
    }

    req.user = user;

    next();
  });
}

import login from './auth/login';
app.use(login);

import register from './auth/register';
app.use(register);

import reset from './auth/reset';
app.use(reset);

import email from './dash/settings/email';
app.use(email);

import phoneNumber from './dash/settings/phone-number';
app.use(phoneNumber);

import password from './dash/settings/password';
app.use(password);

import settingsPersonal from './dash/settings/personal';
app.use(settingsPersonal);

import homePersonal from './dash/home/personal';
app.use(homePersonal);

import booking from './dash/appointment/booking';
app.use(booking);

import doctor from './dash/appointment/doctor';
app.use(doctor);

app.listen(Bun.env.SERVER_PORT, () => {
  console.log(`server running http://localhost:${Bun.env.SERVER_PORT}/`);
});