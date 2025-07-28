"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCheckAccessToken = handleCheckAccessToken;
const validate_access_token_service_1 = require("../../services/validate-access-token.service");
async function handleCheckAccessToken(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    const { valid, payload, error } = (0, validate_access_token_service_1.validateAccessToken)(token);
    if (!valid) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(401).json({ message: 'Invalid or expired token', error: errorMessage });
    }
    return res.status(200).json({ message: 'Token is valid', payload });
}
