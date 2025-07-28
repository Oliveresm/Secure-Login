// src/routes/auth/verify-account.routes.ts
import { Router } from 'express';
import verifyAccountController from '../../controllers/auth/verify-account.controller';

const router = Router();

/**
 * @route GET /auth/verify?token=...
 * @desc Verifies a user account using a verification token
 * @access Public
 */
router.get('/', verifyAccountController.handleVerifyAccount);

export default router;
