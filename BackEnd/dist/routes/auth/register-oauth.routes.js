"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/register-oauth.routes.ts
const express_1 = require("express");
const register_oauth_controller_1 = require("../../controllers/auth/register-oauth.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /auth/register/oauth
 * @desc Registers a new user with OAuth (e.g. Google)
 *       Expects a valid Firebase ID token from client
 *       Automatically marks user as verified
 * @access Public
 */
router.post('/', register_oauth_controller_1.handleRegisterOAuth);
exports.default = router;
