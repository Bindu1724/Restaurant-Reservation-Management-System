
import { Router } from 'express';
import auth from '../middleware/auth.js';
import { create, my, cancelOwnOrAdmin, listAll, adminUpdate } from '../controllers/reservationController.js';

const router = Router();
router.post('/', auth(['customer']), create);
router.get('/my', auth(['customer']), my);
router.delete('/:id', auth(['customer','admin']), cancelOwnOrAdmin);

router.get('/', auth(['admin']), listAll);
router.patch('/:id', auth(['admin']), adminUpdate);

export default router;