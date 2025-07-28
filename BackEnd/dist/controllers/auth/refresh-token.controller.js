"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_refresh_token_service_1 = __importDefault(require("../../services/validate-refresh-token.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const handleRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.body?.refreshToken;
        // Return error if token was not provided
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        // Validate token and extract userId
        const userId = await validate_refresh_token_service_1.default.validateRefreshToken(refreshToken);
        // Generate a new short-lived access token
        const accessToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        return res.json({ accessToken });
    }
    catch (error) {
        // Return error if token is invalid, expired, or any validation fails
        return res.status(401).json({
            message: error.message || 'Invalid or expired refresh token',
        });
    }
};
exports.default = handleRefreshToken;
