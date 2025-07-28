// src/routes/auth/reset-password.route.ts
import { Router } from 'express';
import { handleResetPassword } from '../../controllers/auth/reset-password.controller';

const router = Router();

/**
 * @route POST /auth/reset-password
 * @desc Resets the user's password using a valid recovery token
 * @access Public
 */
router.post('/', handleResetPassword);

export default router;

