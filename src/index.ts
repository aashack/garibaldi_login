import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();
const app = express();
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  }),
);
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (_: express.Request, res: express.Response) => {
  res.send('Auth service alive 🚀');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth service listening on ${PORT}`));
