"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResetPassword = void 0;
const reset_password_schema_1 = __importDefault(require("../../schemas/reset-password.schema"));
const hash_service_1 = __importDefault(require("../../services/hash.service"));
const db_1 = __importDefault(require("../../config/db"));
const handleResetPassword = async (req, res) => {
    try {
        // Validate input schema (token and new password)
        const parsed = reset_password_schema_1.default.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: 'Invalid data' });
        }
        const { token, new_password } = parsed.data;
        const hash = await hash_service_1.default.hash(new_password);
        const db = await db_1.default.getInstance();
        // Execute stored procedure to reset password with token
        await db.query('CALL reset_password_with_recovery_token(?, ?)', [token, hash]);
        return res.status(204).send();
    }
    catch (error) {
        // Token might be expired or invalid (check message contents)
        if (error?.message?.includes('expired') || error?.message?.includes('invalid')) {
            return res.status(401).json({ message: error.message });
        }
        // Fallback for internal error
        return res.status(500).json({
            message: 'Failed to update password',
            error: error.message,
        });
    }
};
exports.handleResetPassword = handleResetPassword;
