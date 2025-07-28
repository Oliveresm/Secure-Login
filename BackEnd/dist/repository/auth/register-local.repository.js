"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_service_1 = __importDefault(require("../../services/hash.service"));
const create_user_model_1 = __importDefault(require("../../models/create-user.model"));
const email_service_1 = __importDefault(require("../../services/email.service"));
const crypto_1 = require("crypto");
const registerLocalUser = async ({ email, display_name, password, }) => {
    // Hash the user's password
    const auth_hash = await hash_service_1.default.hash(password);
    // Generate the raw verification token and hash it
    const raw_token = (0, crypto_1.randomUUID)();
    const out_hash = await hash_service_1.default.hash(raw_token);
    // Create the user in the database with the hashed password and verification token
    await (0, create_user_model_1.default)({
        email,
        display_name,
        auth_type: 'local',
        auth_hash,
        out_hash,
    });
    // Send the verification email to the user with the raw token
    await email_service_1.default.sendVerificationEmail(email, raw_token);
};
exports.default = {
    registerLocalUser,
};
