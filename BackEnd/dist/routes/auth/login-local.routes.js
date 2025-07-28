"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/login-local.route.ts
const express_1 = require("express");
const login_local_controller_1 = require("../../controllers/auth/login-local.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /auth/login
 * @desc Logs in a user using email and password
 * @access Public
 */
router.post('/', login_local_controller_1.handleLocalLogin);
exports.default = router;
