// src/routes/auth/logout.routes.ts
import { Router } from 'express';
import handleLogout from '../../controllers/auth/logout.controller';
import { requireAuth } from '../../middleware/require-auth';

const router = Router();

/**
 * @route   POST /auth/logout
 * @desc    Clears refresh token cookie and removes token from DB
 * @access  Protected (requires valid access token in Authorization header)
 */
router.post('/', requireAuth, handleLogout);

export default router;
