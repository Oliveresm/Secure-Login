import { Router } from 'express';
import authRoutes from './auth.routes';   // This will load all routes under /auth
import userRoutes from './user.routes';   // This will load all routes under /user

const router = Router();

/**
 * Mounts all authentication-related routes under /api/auth
 *
 * Includes:
 * - POST   /api/auth/register/local        → Register user with email/password
 * - POST   /api/auth/login/local           → Login with email/password
 * - GET    /api/auth/verify                → Account verification by token
 * - POST   /api/auth/forgot-password       → Request password reset token
 * - POST   /api/auth/reset-password        → Reset password with token
 * - POST   /api/auth/register/oauth        → Register via Firebase OAuth
 * - POST   /api/auth/login/oauth           → Login via Firebase OAuth
 * - POST   /api/auth/refreshToken          → Refresh access token
 * - GET    /api/auth/check                 → Validate access token (protected route)
 * - PATCH  /api/auth/update-name/oauth     → Set temporary name after OAuth registration
 * - POST   /api/auth/logout                → Invalidate refresh token and logout
 */
router.use('/auth', authRoutes);

/**
 * Mounts all authenticated user routes under /api/user
 *
 * Includes:
 * - PATCH  /api/user/update-name           → Change user's display name
 * - GET    /api/user/me                    → Get current user's info (requires token)
 */
router.use('/user', userRoutes);

export default router;

