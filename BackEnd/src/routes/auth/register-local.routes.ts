// src/routes/auth/register-local.route.ts
import { Router } from 'express';
import { handleLocalRegister } from '../../controllers/auth/register-local.controller';

const router = Router();

/**
 * @route POST /auth/register/local
 * @desc Registers a new user with local credentials (email/password)
 * @access Public
 */
router.post('/', handleLocalRegister);

export default router;
