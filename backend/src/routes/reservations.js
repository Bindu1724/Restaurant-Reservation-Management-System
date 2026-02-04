
import { Router } from 'express';
import { auth, permit } from '../middleware/auth.js';
import { create, my, cancelOwnOrAdmin, listAll, adminUpdate } from '../controllers/reservationController.js';

const router = Router();
router.post('/', auth, permit('customer'), create);
router.get('/my', auth, permit('customer'), my);
router.delete('/:id', auth, permit('customer','admin'), cancelOwnOrAdmin);

router.get('/', auth, permit('admin'), listAll);
router.patch('/:id', auth, permit('admin'), adminUpdate);

export default router;