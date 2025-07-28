"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/register-local.route.ts
const express_1 = require("express");
const register_local_controller_1 = require("../../controllers/auth/register-local.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /auth/register/local
 * @desc Registers a new user with local credentials (email/password)
 * @access Public
 */
router.post('/', register_local_controller_1.handleLocalRegister);
exports.default = router;
