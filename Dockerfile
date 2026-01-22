FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npx prisma generate
RUN npm run build

# Default port (can be overridden via environment variable)
ENV PORT=3000

# Run migrations, seed database with default users, then start the application
# The seed script is idempotent - it won't duplicate existing users
CMD /bin/sh -c "npx prisma migrate deploy && npx ts-node prisma/seed.ts && npm run start"