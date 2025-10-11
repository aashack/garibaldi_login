FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Start the application
CMD ["npm", "run", "start"]