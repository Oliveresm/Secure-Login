import { Request, Response } from 'express';
import UserLookupService from '../../services/user-lookup.service';
import HashService from '../../services/hash.service';
import DB from '../../config/db';
import EmailService from '../../services/email.service';
import { forgotPasswordSchema } from '../../schemas/forgot-password.schema';

export const handleForgotPassword = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const { email } = parsed.data;

    // Look up user by email
    const user = await UserLookupService.getUserByEmail(email);

    // For security: never reveal if the email exists or not
    if (!user) return res.status(204).send();

    // Generate a secure token and save it to the database
    const token = await HashService.generateToken();
    const db = await DB.getInstance();

    await db.query(`CALL generate_expired_recovery_token(?, ?)`, [email, token]);

    // Send recovery email with the token
    await EmailService.sendPasswordRecoveryEmail(email, token);

    // Return 204 No Content even if email was sent
    return res.status(204).send();
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      message: 'Error processing the request',
      error: (error as Error).message,
    });
  }
};

