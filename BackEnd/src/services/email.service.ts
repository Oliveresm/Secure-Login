// src/services/email.service.ts
import Mailer from '../config/mail.config';

const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5174';

const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const transporter = Mailer.getInstance();

  const mailOptions = {
    from: '"WhatsClone" <no-reply@whatsclone.com>',
    to,
    subject: 'Verify your account',
    html: `
      <h3>Welcome!</h3>
      <p>Click the link below to verify your account:</p>
      <a href="${frontendBaseUrl}/verify?token=${encodeURIComponent(token)}">
        Verify Account
      </a>
      <p>This link will expire in 60 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordRecoveryEmail = async (to: string, token: string): Promise<void> => {
  const transporter = Mailer.getInstance();

  const mailOptions = {
    from: '"WhatsClone" <no-reply@whatsclone.com>',
    to,
    subject: 'Reset your password',
    html: `
      <h3>Forgot your password?</h3>
      <p>Click the link below to set a new password:</p>
      <a href="${frontendBaseUrl}/reset-password?token=${encodeURIComponent(token)}">
        Reset Password
      </a>
      <p>This link will expire in 60 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default {
  sendVerificationEmail,
  sendPasswordRecoveryEmail,
};
