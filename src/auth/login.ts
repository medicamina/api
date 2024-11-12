import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const login = Router();

login.post('/auth/login', async (req, res) => {
	let email = req.body.email;
	const password = req.body.password;
  if (!email || !password) {
    res.status(400).send('Missing JSON body {email, password}');
    return;
  }
  email = email.toLowerCase();
  
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: true
    }
  });

  if (user && user.password) {
    const isMatch = await Bun.password.verify(password, user.password);
    delete (user as { password?: string }).password;

    if (isMatch) {
      res.status(200).send({ auth: jwt.sign(user, Bun.env.JWT_SECRET_TOKEN as string) });
      return;
    }
  }

  res.status(400).send('Invalid login credentials');
  return;
});
login.get('/auth/login', (req, res) => {
  res.send('Hello World');
});

export default login;
