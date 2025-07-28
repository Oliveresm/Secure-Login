"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOAuthLogin = void 0;
const login_oauth_repository_1 = __importDefault(require("../../repository/auth/login-oauth.repository"));
const login_oauth_schema_1 = require("../../schemas/login-oauth.schema");
const handleOAuthLogin = async (req, res) => {
    try {
        // Validate input using Zod schema
        const parsed = login_oauth_schema_1.loginOAuthSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Invalid data',
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const { email, uid } = parsed.data;
        // Attempt login via repository (validate UID and generate tokens)
        const token = await login_oauth_repository_1.default.login(email, uid);
        return res.status(200).json({
            message: 'Login successful',
            token,
        });
    }
    catch (error) {
        return res.status(401).json({
            message: 'Invalid credentials or unverified user',
            error: error.message,
        });
    }
};
exports.handleOAuthLogin = handleOAuthLogin;
