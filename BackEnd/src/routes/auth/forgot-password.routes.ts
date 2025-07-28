// src/routes/auth/forgot-password.route.ts
import { Router } from 'express';
import { handleForgotPassword } from '../../controllers/auth/forgot-password.controller';

const router = Router();

/**
 * @route POST /auth/forgot-password
 * @desc Initiates the password recovery process by sending a recovery email.
 * @access Public
 */
router.post('/', handleForgotPassword);

export default router;
