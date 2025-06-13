import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { transporter, sendPasswordReset } from '../utils/services/mailerService';

const prisma = new PrismaClient();
const router = Router();

// 1. Random user (seed / testing)
router.post('/random-user', async (_: Request, res: Response) => {
  const user = {
    username: faker.internet.userName().toLowerCase(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
  };
  const created = await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      passwordHash: await hashPassword(user.password),
    },
  });
  res.json({ ...user, id: created.id });
});

// 2. Login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken(user.id, user.username);
  res.json({ token });
});

// 3. Forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(200).json({ message: 'If account exists, email sent' }); // don’t leak

  const token = uuid();
  const expiresAt = new Date(Date.now() + 15 * 60_000);
  await prisma.passwordReset.create({
    data: { token, userId: user.id, expiresAt },
  });

  const link = `http://localhost:3000/reset-password?token=${token}`;
  await sendPasswordReset(email, link);

  res.json({ message: 'Email sent' });
});

// 4. Reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const record = await prisma.passwordReset.findUnique({ where: { token } });
  if (!record || record.used || record.expiresAt < new Date())
    return res.status(400).json({ error: 'Invalid/expired token' });

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });
  await prisma.passwordReset.update({
    where: { token },
    data: { used: true },
  });

  res.json({ message: 'Password updated' });
});

export default router;