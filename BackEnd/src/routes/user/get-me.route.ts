// src/routes/user/get-me.route.ts
import { Router } from 'express';
import { handleGetMe } from '../../controllers/user/get-me.controller';
import { requireAuth } from '../../middleware/require-auth';

const router = Router();

/**
 * GET /user/me
 * Returns the current user's info based on the access token.
 * Requires Authorization header with Bearer token.
 */
router.get('/', requireAuth, handleGetMe);

export default router;
