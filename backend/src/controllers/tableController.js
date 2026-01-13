
import Table from '../models/Table.js';

export async function list(req, res, next) {
  try { res.json(await Table.find().sort({ name: 1 })); }
  catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const t = await Table.create(req.body); // { name, capacity, isActive }
    res.status(201).json(t);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const t = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Table not found' });
    res.json(t);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const t = await Table.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!t) return res.status(404).json({ message: 'Table not found' });
    res.json(t);
  } catch (e) { next(e); }
}