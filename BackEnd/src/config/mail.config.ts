// src/config/mail.config.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

class Mailer {
  // Singleton instance of the transporter
  private static instance: nodemailer.Transporter;

  // Returns the transporter instance, or creates it if it doesn't exist
  static getInstance(): nodemailer.Transporter {
    if (!Mailer.instance) {
      Mailer.instance = nodemailer.createTransport({
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

export default Mailer;
