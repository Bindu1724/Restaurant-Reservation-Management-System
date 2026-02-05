
import Table from '../models/Table.js';

export async function list(req, res, next) {
  try {
    const tables = await Table.find({ isActive: true }).sort({ name: 1 });
    res.json(tables);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const { name, capacity, isActive } = req.body;
    if (!name || !capacity) {
      return res.status(400).json({ message: 'Name and capacity are required' });
    }
    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum < 1) {
      return res.status(400).json({ message: 'Capacity must be a valid number >= 1' });
    }
    const t = await Table.create({ name, capacity: capacityNum, isActive: isActive !== false });
    res.status(201).json(t);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: `Table name '${e.keyValue.name}' already exists` });
    }
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const { name, capacity } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (capacity) {
      const capacityNum = parseInt(capacity);
      if (isNaN(capacityNum) || capacityNum < 1) {
        return res.status(400).json({ message: 'Capacity must be a valid number >= 1' });
      }
      updates.capacity = capacityNum;
    }
    
    const t = await Table.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!t) return res.status(404).json({ message: 'Table not found' });
    res.json(t);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: `Table name '${e.keyValue?.name}' already exists` });
    }
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const t = await Table.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!t) return res.status(404).json({ message: 'Table not found' });
    res.json(t);
  } catch (e) { 
    next(e); 
  }
}