"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes")); // This will load all routes under /auth
const router = (0, express_1.Router)();
/**
 * Mounts all authentication-related routes under /api/auth
 *
 * Includes:
 * - POST   /api/auth/register/local         – Register user with email/password
 * - POST   /api/auth/login/local            – Login with email/password
 * - GET    /api/auth/verify                 – Account verification by token
 * - POST   /api/auth/refreshToken           – Refresh access token
 * - POST   /api/auth/forgot-password        – Request password reset token
 * - POST   /api/auth/reset-password         – Reset password with token
 * - POST   /api/auth/register/oauth         – Register via Firebase OAuth
 * - POST   /api/auth/login/oauth            – Login via Firebase OAuth
 * - GET    /api/auth/check                  – Validate access token (protected route)
 */
router.use('/auth', auth_routes_1.default);
exports.default = router;
