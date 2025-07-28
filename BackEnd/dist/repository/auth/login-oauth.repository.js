"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_lookup_service_1 = __importDefault(require("../../services/user-lookup.service"));
const db_1 = __importDefault(require("../../config/db"));
const login = async (email, uid) => {
    const user = await user_lookup_service_1.default.getUserByEmail(email);
    if (!user)
        throw new Error('User does not exist');
    if (!user.is_verified)
        throw new Error('Account is not verified');
    if (user.auth_hash !== uid)
        throw new Error('Invalid OAuth token UID');
    // Generate access token
    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Generate refresh token
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
    // Store refresh token in DB
    const db = await db_1.default.getInstance();
    await db.query('CALL store_refresh_token(?, ?)', [user.id, refreshToken]);
    return { accessToken, refreshToken };
};
exports.default = {
    login,
};
