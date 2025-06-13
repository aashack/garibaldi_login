// src/services/mailerService.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordReset = async (email: string, link: string) =>
  transporter.sendMail({
    from: '"Auth Service" <no-reply@garibaldi.io>',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${link}">here</a> to reset your password. Expires in 15 min.</p>`,
  });