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

# Run migrations and start the application
CMD /bin/sh -c "npx prisma migrate deploy && npm run start"