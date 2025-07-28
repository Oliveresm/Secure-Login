"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/refresh-token.route.ts
const express_1 = require("express");
const refresh_token_controller_1 = __importDefault(require("../../controllers/auth/refresh-token.controller"));
const router = (0, express_1.Router)();
/**
 * @route POST /auth/refresh-token
 * @desc Issues a new access token using a valid refresh token
 * @access Public
 */
router.post('/', refresh_token_controller_1.default);
exports.default = router;
