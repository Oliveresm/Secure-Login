"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/reset-password.route.ts
const express_1 = require("express");
const reset_password_controller_1 = require("../../controllers/auth/reset-password.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /auth/reset-password
 * @desc Resets the user's password using a valid recovery token
 * @access Public
 */
router.post('/', reset_password_controller_1.handleResetPassword);
exports.default = router;
