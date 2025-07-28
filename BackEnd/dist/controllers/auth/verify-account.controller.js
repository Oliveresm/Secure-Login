"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVerifyAccount = void 0;
const db_1 = __importDefault(require("../../config/db"));
const handleVerifyAccount = async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({ message: 'Verification token is missing.' });
    }
    try {
        const conn = await db_1.default.getInstance();
        await conn.query('CALL verify_user_by_token(?)', [token]);
        return res.status(200).json({ message: 'User verified successfully' });
    }
    catch (e) {
        return res.status(500).json({
            message: 'Error verifying account.',
            error: e.message,
        });
    }
};
exports.handleVerifyAccount = handleVerifyAccount;
exports.default = {
    handleVerifyAccount: exports.handleVerifyAccount,
};
