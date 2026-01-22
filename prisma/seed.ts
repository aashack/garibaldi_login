import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================================
// SEED USER CONFIGURATION
// ============================================================
// This script creates default users when the database is seeded.
// It runs automatically during Docker container startup.
// 
// To add more seed users, add entries to the SEED_USERS array below.
// To change or remove users, modify this array accordingly.
// ============================================================

const SEED_USERS = [
  {
    email: 'aashack@gmail.com',
    password: 'Bu11ernu1!',
  },
  // Add more seed users here as needed:
  // {
  //   email: 'another@example.com',
  //   password: 'securePassword123',
  // },
];

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('Starting database seed...');

  for (const seedUser of SEED_USERS) {
    const email = seedUser.email.toLowerCase();
    
    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: { email },
    });

    if (existing) {
      console.log(`User ${email} already exists, skipping...`);
      continue;
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        username: email,  // Use email as username for email-only auth
        email: email,
        passwordHash: await hashPassword(seedUser.password),
      },
    });

    console.log(`Created user: ${user.email} (ID: ${user.id})`);
  }

  console.log('Database seed completed.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
