"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLocalLogin = void 0;
const login_local_repository_1 = __importDefault(require("../../repository/auth/login-local.repository"));
const login_local_schema_1 = require("../../schemas/login-local.schema");
const handleLocalLogin = async (req, res) => {
    try {
        // Validate input using Zod schema
        const parsed = login_local_schema_1.loginLocalSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Invalid data',
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const { email, password } = parsed.data;
        // Attempt login via repository (handles credential check and token generation)
        const token = await login_local_repository_1.default.login(email, password);
        return res.status(200).json({
            message: 'Login successful',
            token,
        });
    }
    catch (error) {
        // Handle errors like invalid credentials or unverified user
        return res.status(401).json({
            message: 'Invalid credentials or unverified user',
            error: error.message,
        });
    }
};
exports.handleLocalLogin = handleLocalLogin;
