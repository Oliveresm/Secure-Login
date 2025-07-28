"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/forgot-password.route.ts
const express_1 = require("express");
const forgot_password_controller_1 = require("../../controllers/auth/forgot-password.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /auth/forgot-password
 * @desc Initiates the password recovery process by sending a recovery email.
 * @access Public
 */
router.post('/', forgot_password_controller_1.handleForgotPassword);
exports.default = router;
