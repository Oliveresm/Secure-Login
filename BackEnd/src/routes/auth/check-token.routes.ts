// src/routes/auth/check-token.routes.ts
import { Router } from 'express';
import { handleCheckAccessToken } from '../../controllers/auth/check-token.controller';

const router = Router();

/**
 * @route GET /auth/check
 * @desc  Validates access token and returns user payload if valid
 * @access Public
 */
router.get('/', handleCheckAccessToken);

export default router;
