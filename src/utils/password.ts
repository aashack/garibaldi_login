import bcrypt from 'bcryptjs';
const SALT = 10;

export const hashPassword = async (plain: string) =>
  bcrypt.hash(plain, SALT);

export const verifyPassword = async (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);