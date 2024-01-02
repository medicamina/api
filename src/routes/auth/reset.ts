import { HttpError, createApplication } from '@nbit/bun';
import * as nodemailer from 'nodemailer';

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

export default defineRoutes((app) => [
  app.post('/auth/reset/:token', async (request) => {
    
  }),
  app.post('/auth/reset', async (request) => {
    const { email } = await request.json();
    if (!email) {
      throw new HttpError(400, "Missing JSON body {email}");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const resetToken = crypto.randomUUID();
      const updateUser = await prisma.user.update({
        where: {
          email,
        },
        data: {
          resetToken,
        },
      });

      const mailOptions = {
        from: 'admin@medicamina.com',
        to: email,
        subject: 'Medicamina password reset',
        text: `https://medicamina.us/auth/reset/${resetToken}`,
        html: `<a href="https://medicamina.us/auth/reset/${resetToken}">Click here to reset password</a>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          throw new HttpError(500, error);
        }
        return { status: 200, msg: 'Check your email' };
      });
 
    }

    throw new HttpError(400, "Invalid email");
  }),
]);