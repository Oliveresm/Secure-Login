"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/index.ts
const express_1 = require("express");
const register_local_routes_1 = __importDefault(require("./auth/register-local.routes"));
const verify_account_routes_1 = __importDefault(require("./auth/verify-account.routes"));
const login_local_routes_1 = __importDefault(require("./auth/login-local.routes"));
const refresh_token_routes_1 = __importDefault(require("./auth/refresh-token.routes"));
const forgot_password_routes_1 = __importDefault(require("./auth/forgot-password.routes"));
const reset_password_routes_1 = __importDefault(require("./auth/reset-password.routes"));
const register_oauth_routes_1 = __importDefault(require("./auth/register-oauth.routes"));
const login_oauth_routes_1 = __importDefault(require("./auth/login-oauth.routes"));
const check_token_routes_1 = __importDefault(require("./auth/check-token.routes"));
const router = (0, express_1.Router)();
/**
 * POST /auth/register/local
 * Registers a new user using local authentication (email and password).
 * Sends a verification email with a temporary token valid for 5 minutes.
 */
router.use('/register/local', register_local_routes_1.default);
/**
 * POST /auth/login/local
 * Logs in a user using email and password.
 * Returns access and refresh tokens if credentials are valid and the account is verified.
 */
router.use('/login/local', login_local_routes_1.default);
/**
 * GET /auth/verify?token=...
 * Verifies a user's account using the token sent via email after registration.
 * If the token is valid and not expired, the user is marked as verified.
 */
router.use('/verify', verify_account_routes_1.default);
/**
 * POST /auth/refreshToken
 * Generates a new access token from a valid refresh token.
 * The refresh token must have been previously issued and stored in the DB.
 */
router.use('/refreshToken', refresh_token_routes_1.default);
/**
 * POST /auth/forgot-password
 * Starts the password recovery process.
 * If the email exists, a secure token is generated and emailed to the user.
 * This token can later be used to reset the password (valid for 5 minutes).
 */
router.use('/forgot-password', forgot_password_routes_1.default);
/**
 * POST /auth/reset-password
 * Resets the user's password using a valid recovery token.
 * If the token is valid and not expired, the password is updated.
 */
router.use('/reset-password', reset_password_routes_1.default);
/**
 * POST /auth/register/oauth
 * Registers a new user using an OAuth provider (like Google).
 * The request must include a valid Firebase ID token.
 * If successful, a verified user is created in the DB (no password).
 */
router.use('/register/oauth', register_oauth_routes_1.default);
/**
 * POST /auth/login/oauth
 * Logs in a user using an OAuth provider (e.g. Google).
 * The request must include a valid Firebase ID token.
 * If successful, access and refresh tokens are returned.
 */
router.use('/login/oauth', login_oauth_routes_1.default);
/**
 * GET /auth/check
 * Validates an access token sent via the Authorization header.
 * If the token is valid, returns the user payload.
 * If the token is invalid or expired, returns 401 Unauthorized.
 */
router.use('/check', check_token_routes_1.default);
exports.default = router;
