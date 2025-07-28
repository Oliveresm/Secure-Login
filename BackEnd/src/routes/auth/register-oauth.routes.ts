// src/routes/auth/register-oauth.routes.ts
import { Router } from 'express';
import { handleRegisterOAuth } from '../../controllers/auth/register-oauth.controller';


const router = Router();

/**
 * @route POST /auth/register/oauth
 * @desc Registers a new user with OAuth (e.g. Google)
 *       Expects a valid Firebase ID token from client
 *       Automatically marks user as verified
 * @access Public
 */
router.post('/', handleRegisterOAuth);

export default router;
