import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

const SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = '15m';          // Token expiration time
interface Payload {
  sub: string;           // userId
  username: string;
  reqId: string;
}

export const signToken = (userId: string, username: string) => {
  const payload: Payload = { sub: userId, username, reqId: uuid() };
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET) as Payload & { exp: number };