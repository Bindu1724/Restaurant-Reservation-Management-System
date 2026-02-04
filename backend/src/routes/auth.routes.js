
import express from 'express';
import {registerUser, loginUser} from '../controllers/authController.js';
const router = express.Router();

// Use controller handlers directly and return consistent responses expected by client
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;