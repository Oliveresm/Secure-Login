"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/email.service.ts
const mail_config_1 = __importDefault(require("../config/mail.config"));
const sendVerificationEmail = async (to, token) => {
    const transporter = mail_config_1.default.getInstance();
    const mailOptions = {
        from: '"WhatsClone" <no-reply@whatsclone.com>',
        to,
        subject: 'Verify your account',
        html: `
      <h3>Welcome!</h3>
      <p>Click the link below to verify your account:</p>
      <a href="http://localhost:3000/verify?token=${encodeURIComponent(token)}">
        Verify Account
      </a>
      <p>This link will expire in 5 minutes.</p>
    `,
    };
    await transporter.sendMail(mailOptions);
};
const sendPasswordRecoveryEmail = async (to, token) => {
    const transporter = mail_config_1.default.getInstance();
    const mailOptions = {
        from: '"WhatsClone" <no-reply@whatsclone.com>',
        to,
        subject: 'Reset your password',
        html: `
      <h3>Forgot your password?</h3>
      <p>Click the link below to set a new password:</p>
      <a href="http://localhost:3000/reset-password?token=${encodeURIComponent(token)}">
        Reset Password
      </a>
      <p>This link will expire in 5 minutes.</p>
    `,
    };
    await transporter.sendMail(mailOptions);
};
exports.default = {
    sendVerificationEmail,
    sendPasswordRecoveryEmail,
};
