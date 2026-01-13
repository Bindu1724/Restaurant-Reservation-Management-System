
import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import { isValidSlot, isFutureDate } from '../utils/slots.js';

export async function create(req, res, next) {
  try {
    const { tableId, date, timeSlot, guests } = req.body;
    if (!tableId || !date || !timeSlot || !guests) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    if (!isValidSlot(timeSlot)) return res.status(400).json({ message: 'Invalid time slot' });
    if (!isFutureDate(date)) return res.status(400).json({ message: 'Date must be today or future' });

    const table = await Table.findById(tableId);
    if (!table || !table.isActive) return res.status(404).json({ message: 'Table not found or inactive' });
    if (guests > table.capacity) return res.status(409).json({ message: 'Guest count exceeds table capacity' });

    const r = await Reservation.create({
      customer: req.user.id, table: tableId, date, timeSlot, guests
    });
    res.status(201).json(r);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Table already booked for this slot' });
    next(err);
  }
}

export async function my(req, res, next) {
  try {
    const items = await Reservation.find({ customer: req.user.id }).populate('table','name capacity').sort({ date: 1, timeSlot: 1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function cancelOwnOrAdmin(req, res, next) {
  try {
    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Reservation not found' });
    if (req.user.role === 'customer' && r.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    r.status = 'cancelled';
    await r.save();
    res.json(r);
  } catch (e) { next(e); }
}

export async function listAll(req, res, next) {
  try {
    const q = {};
    if (req.query.date) q.date = req.query.date;
    const items = await Reservation.find(q)
      .populate('customer','name email')
      .populate('table','name capacity')
      .sort({ date: 1, timeSlot: 1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function adminUpdate(req, res, next) {
  try {
    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Reservation not found' });

    const { tableId, date, timeSlot, guests, status } = req.body;
    if (tableId) r.table = tableId;
    if (date) {
      if (!isFutureDate(date)) return res.status(400).json({ message: 'Invalid date' });
      r.date = date;
    }
    if (timeSlot) {
      if (!isValidSlot(timeSlot)) return res.status(400).json({ message: 'Invalid slot' });
      r.timeSlot = timeSlot;
    }
    if (typeof guests === 'number') r.guests = guests;
    if (status) r.status = status;

    const table = await Table.findById(r.table);
    if (!table || !table.isActive) return res.status(404).json({ message: 'Table invalid' });
    if (r.guests > table.capacity) return res.status(409).json({ message: 'Exceeds capacity' });

    await r.save(); // unique index enforces conflicts
    res.json(r);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Table already booked for this slot' });
    next(err);
  }
}