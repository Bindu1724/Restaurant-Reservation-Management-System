
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role }); // lock role in prod
    res.status(201).json({ id: user._id, email: user.email });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, name: user.name });
  } catch (e) {
    if (typeof next === 'function') return next(e);
    return res.status(400).json({ message: e.message || 'Login failed' });
  }
}