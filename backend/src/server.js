import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import tableRoutes from './routes/tables.js';
import reservationRoutes from './routes/reservations.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);

import { auth } from './middleware/auth.js';
app.get('/api/test/role', auth, (req, res) => {
  res.json({ email: req.user?.email, role: req.user?.role });
});

app.get('/ping', ( req, res ) => {
  res.send('Pong');
})


const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};
start();