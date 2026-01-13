// src/routes/tables.js
import { Router } from 'express';
import auth from '../middleware/auth.js';
import { list, create, update, remove } from '../controllers/tableController.js';
const router = Router();

router.get('/', auth(['admin','customer']), list); // customers need to select a table
router.post('/', auth(['admin']), create);
router.patch('/:id', auth(['admin']), update);
router.delete('/:id', auth(['admin']), remove);

export default router;