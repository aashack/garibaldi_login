# garibaldi_login
Login application


docker-compose
├─ auth-db (Postgres)  ← Prisma ORM
├─ redis               ← Active JWT blacklist + any cache
└─ garibaldi_login
     ├─ Express HTTP API
     ├─ JWT            ← HS256 signed, 15-min exp
     ├─ Nodemailer     ← SMTP or Mailtrap
     └─ Prisma Client  ← Postgres
