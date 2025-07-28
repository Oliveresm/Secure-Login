"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegisterOAuth = void 0;
const firebase_service_1 = require("../../services/firebase.service");
const create_user_model_1 = __importDefault(require("../../models/create-user.model"));
const handleRegisterOAuth = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ message: 'Missing idToken' });
    }
    try {
        const decoded = await (0, firebase_service_1.verifyFirebaseToken)(idToken);
        const email = decoded.email;
        const displayName = decoded.name || 'Unnamed';
        const uid = decoded.uid;
        if (!email || !uid) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }
        await (0, create_user_model_1.default)({
            email,
            display_name: displayName,
            auth_type: 'oauth',
            auth_hash: uid,
            out_hash: null,
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error('OAuth register error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.handleRegisterOAuth = handleRegisterOAuth;
