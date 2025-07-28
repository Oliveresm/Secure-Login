"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleForgotPassword = void 0;
const user_lookup_service_1 = __importDefault(require("../../services/user-lookup.service"));
const hash_service_1 = __importDefault(require("../../services/hash.service"));
const db_1 = __importDefault(require("../../config/db"));
const email_service_1 = __importDefault(require("../../services/email.service"));
const forgot_password_schema_1 = require("../../schemas/forgot-password.schema");
const handleForgotPassword = async (req, res) => {
    try {
        // Validate input using Zod schema
        const parsed = forgot_password_schema_1.forgotPasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        const { email } = parsed.data;
        // Look up user by email
        const user = await user_lookup_service_1.default.getUserByEmail(email);
        // For security: never reveal if the email exists or not
        if (!user)
            return res.status(204).send();
        // Generate a secure token and save it to the database
        const token = await hash_service_1.default.generateToken();
        const db = await db_1.default.getInstance();
        await db.query(`CALL generate_expired_recovery_token(?, ?)`, [email, token]);
        // Send recovery email with the token
        await email_service_1.default.sendPasswordRecoveryEmail(email, token);
        // Return 204 No Content even if email was sent
        return res.status(204).send();
    }
    catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            message: 'Error processing the request',
            error: error.message,
        });
    }
};
exports.handleForgotPassword = handleForgotPassword;
