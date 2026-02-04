// src/routes/tables.js
import { Router } from 'express';
import { auth, permit } from '../middleware/auth.js';
import { list, create, update, remove } from '../controllers/tableController.js';
const router = Router();


router.get('/', auth, permit('admin','customer'), list); // customers need to select a table
router.post('/', auth, permit('admin'), create);
router.patch('/:id', auth, permit('admin'), update);
router.delete('/:id', auth, permit('admin'), remove);

export default router;