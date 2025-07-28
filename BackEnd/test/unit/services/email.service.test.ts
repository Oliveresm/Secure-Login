import { describe, it, vi, expect } from 'vitest';
import emailService from '../../../src/services/email.service';
import Mailer from '../../../src/config/mail.config';
import nodemailer from 'nodemailer';

// Mock nodemailer to prevent actual emails from being sent
vi.mock('nodemailer', async () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: vi.fn().mockResolvedValue({
          accepted: ['test@example.com'],
        }),
      })),
    },
  };
});

describe('emailService', () => {
  it('should send a verification email', async () => {
    const spy = vi.spyOn(Mailer, 'getInstance');
    const testEmail = 'test@example.com';
    const testToken = 'fake-token';

    await expect(
      emailService.sendVerificationEmail(testEmail, testToken)
    ).resolves.not.toThrow(); // Should not throw any error

    expect(spy).toHaveBeenCalled(); // Ensures transporter was used
  });

  it('should send a password recovery email', async () => {
    const spy = vi.spyOn(Mailer, 'getInstance');
    const testEmail = 'test@example.com';
    const testToken = 'fake-token';

    await expect(
      emailService.sendPasswordRecoveryEmail(testEmail, testToken)
    ).resolves.not.toThrow(); // Should not throw any error

    expect(spy).toHaveBeenCalled(); // Ensures transporter was used
  });
});
