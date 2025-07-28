// src/routes/auth/login-oauth.routes.ts
import { Router } from 'express';
import { handleLoginOauth } from '../../controllers/auth/login-oauth.controller';

const router = Router();

/**
 * @route POST /auth/login/oauth
 * @desc Logs in a user using OAuth (e.g. Google)
 *       Expects a valid Firebase ID token from client
 *       Returns access and refresh tokens if successful
 * @access Public
 */
router.post('/', handleLoginOauth);

export default router;
