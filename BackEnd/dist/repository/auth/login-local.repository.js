"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hash_service_1 = __importDefault(require("../../services/hash.service"));
const user_lookup_service_1 = __importDefault(require("../../services/user-lookup.service"));
const db_1 = __importDefault(require("../../config/db"));
const login = async (email, password) => {
    const user = await user_lookup_service_1.default.getUserByEmail(email);
    if (!user)
        throw new Error('User does not exist');
    if (!user.is_verified)
        throw new Error('Account is not verified');
    const passwordIsValid = await hash_service_1.default.compare(password, user.auth_hash);
    if (!passwordIsValid)
        throw new Error('Incorrect password');
    // 1. Generate tokens
    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
    // 2. Save refresh token in DB via stored procedure
    const db = await db_1.default.getInstance();
    await db.query('CALL store_refresh_token(?, ?)', [user.id, refreshToken]);
    return { accessToken, refreshToken };
};
exports.default = {
    login,
};
