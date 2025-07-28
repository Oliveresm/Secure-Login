"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/mail.config.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env
dotenv_1.default.config();
class Mailer {
    // Returns the transporter instance, or creates it if it doesn't exist
    static getInstance() {
        if (!Mailer.instance) {
            Mailer.instance = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: false, // Set to true if using port 465
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }
        return Mailer.instance;
    }
}
exports.default = Mailer;
