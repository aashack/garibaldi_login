import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (_: express.Request, res: express.Response) => {
  res.send('Auth service alive 🚀');
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Auth service listening on ${PORT}`));