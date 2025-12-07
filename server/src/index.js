import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth.js';
import appointmentsRouter from './routes/appointments.js';
import adminRouter from './routes/admin.js';

export const prisma = new PrismaClient();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/appointments', appointmentsRouter);
app.use('/admin', adminRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
