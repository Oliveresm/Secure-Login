// src/routes/auth/login-local.route.ts
import { Router } from 'express';
import { handleLoginLocal } from '../../controllers/auth/login-local.controller';

const router = Router();

/**
 * @route POST /auth/login
 * @desc Logs in a user using email and password
 * @access Public
 */
router.post('/', handleLoginLocal);

export default router;
