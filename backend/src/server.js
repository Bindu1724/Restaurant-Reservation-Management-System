import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import error from './middleware/error.js';
import authRoutes from './routes/auth.js';
import tableRoutes from './routes/tables.js';
import reservationRoutes from './routes/reservations.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/tables', tableRoutes);
app.use('/reservations', reservationRoutes);

app.use(error);

const port = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(port, () => console.log(`API on http://localhost:${port}`));
});