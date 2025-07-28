"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/verify-account.routes.ts
const express_1 = require("express");
const verify_account_controller_1 = __importDefault(require("../../controllers/auth/verify-account.controller"));
const router = (0, express_1.Router)();
/**
 * @route GET /auth/verify?token=...
 * @desc Verifies a user account using a verification token
 * @access Public
 */
router.get('/', verify_account_controller_1.default.handleVerifyAccount);
exports.default = router;
