"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/login-oauth.routes.ts
const express_1 = require("express");
const login_oauth_controller_1 = require("../../controllers/auth/login-oauth.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /auth/login/oauth
 * @desc Logs in a user using OAuth (e.g. Google)
 *       Expects a valid Firebase ID token from client
 *       Returns access and refresh tokens if successful
 * @access Public
 */
router.post('/', login_oauth_controller_1.handleOAuthLogin);
exports.default = router;
