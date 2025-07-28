// src/routes/auth/index.ts
import { Router } from 'express';
import registerLocalRoutes from './auth/register-local.routes';
import verifyAccountRoutes from './auth/verify-account.routes';
import loginLocalRoutes from './auth/login-local.routes';
import refreshTokenRoutes from './auth/refresh-token.routes';
import forgotPasswordRoutes from './auth/forgot-password.routes';
import resetPasswordRoutes from './auth/reset-password.routes';
import registerOAuthRoutes from './auth/register-oauth.routes';
import loginOAuthRoutes from './auth/login-oauth.routes';
import checkTokenRoutes from './auth/check-token.routes';
import oauthUpdateNameRouter from './auth/oauth-update-name.route';
import logoutRoutes from './auth/logout.routes'


const router = Router();

/**
 * POST /auth/register/local
 * Registers a new user using local authentication (email and password).
 * Sends a verification email with a temporary token valid for 5 minutes.
 */
router.use('/register/local', registerLocalRoutes);

/**
 * POST /auth/login/local
 * Logs in a user using email and password.
 * Returns access and refresh tokens if credentials are valid and the account is verified.
 */
router.use('/login/local', loginLocalRoutes);

/**
 * GET /auth/verify?token=...
 * Verifies a user's account using the token sent via email after registration.
 * If the token is valid and not expired, the user is marked as verified.
 */
router.use('/verify', verifyAccountRoutes);

/**
 * POST /auth/refreshToken
 * Issues a new access token using the refresh token stored in an HTTP-only cookie.
 * No request body is needed.
 * Returns: { accessToken } on success.
 */
router.use('/refreshToken', refreshTokenRoutes);

/**
 * POST /auth/forgot-password
 * Starts the password recovery process.
 * If the email exists, a secure token is generated and emailed to the user.
 * This token can later be used to reset the password (valid for 5 minutes).
 */
router.use('/forgot-password', forgotPasswordRoutes);

/**
 * POST /auth/reset-password
 * Resets the user's password using a valid recovery token.
 * If the token is valid and not expired, the password is updated.
 */
router.use('/reset-password', resetPasswordRoutes);

/**
 * POST /auth/register/oauth
 * Registers a new user using an OAuth provider (like Google).
 * The request must include a valid Firebase ID token.
 * If successful, a verified user is created in the DB (no password).
 */
router.use('/register/oauth', registerOAuthRoutes);

/**
 * POST /auth/login/oauth
 * Logs in a user using an OAuth provider (e.g. Google).
 * The request must include a valid Firebase ID token.
 * If successful, access and refresh tokens are returned.
 */
router.use('/login/oauth', loginOAuthRoutes);
/**
 * GET /auth/check
 * Validates an access token sent via the Authorization header.
 * If the token is valid, returns the user payload.
 * If the token is invalid or expired, returns 401 Unauthorized.
 */
router.use('/check', checkTokenRoutes);

/**
 * PATCH /auth/update-name/oauth
 * Sets a temporary display name right after Google OAuth registration.
 * Expects: { userId, newName } in the body.
 * Returns 204 No Content on success.
 */
router.use('/update-name/oauth', oauthUpdateNameRouter);


/**
 * POST /auth/logout
 * Logs out the user by clearing the refresh token cookie and removing the token from the DB.
 * Requires: Bearer access token in Authorization header.
 * Returns: 204 No Content on success.
 */
router.use('/logout', logoutRoutes);


export default router;
