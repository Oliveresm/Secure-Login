"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/check-token.routes.ts
const express_1 = require("express");
const check_token_controller_1 = require("../../controllers/auth/check-token.controller");
const router = (0, express_1.Router)();
/**
 * @route GET /auth/check
 * @desc  Validates access token and returns user payload if valid
 * @access Public
 */
router.get('/', check_token_controller_1.handleCheckAccessToken);
exports.default = router;
