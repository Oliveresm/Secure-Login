"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccessToken = validateAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function validateAccessToken(token) {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error('JWT_SECRET is not defined');
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return { valid: true, payload: decoded };
    }
    catch (err) {
        return { valid: false, error: err };
    }
}
