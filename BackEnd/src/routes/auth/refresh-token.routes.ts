// src/routes/auth/refresh-token.route.ts
import { Router } from 'express';
import RefreshTokenController from '../../controllers/auth/refresh-token.controller';

const router = Router();

/**
 * @route POST /auth/refresh-token
 * @desc Issues a new access token using a valid refresh token
 * @access Public
 */
router.post('/', RefreshTokenController);

export default router;
