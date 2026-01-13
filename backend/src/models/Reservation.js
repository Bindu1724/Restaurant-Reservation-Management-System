
import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  date: { type: String, required: true },      // YYYY-MM-DD
  timeSlot: { type: String, required: true },  // canonical from SLOTS
  guests: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['active','cancelled'], default: 'active' }
}, { timestamps: true });

// Prevent double booking for active reservations
reservationSchema.index(
  { table: 1, date: 1, timeSlot: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);

export default mongoose.model('Reservation', reservationSchema);