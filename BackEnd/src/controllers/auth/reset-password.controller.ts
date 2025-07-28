// src/controllers/auth/reset-password.controller.ts
import { Request, Response } from 'express';
import resetPasswordSchema from '../../schemas/reset-password.schema';
import HashService from '../../services/hash.service';
import DB from '../../config/db';

export const handleResetPassword = async (req: Request, res: Response) => {
  try {
    // 1) Validate body (token y new_password)
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const { token, new_password } = parsed.data;

    // 2) Hash the new password (bcrypt)
    const newPasswordHash = await HashService.hash(new_password);

    // 3) Execute stored procedure
    const db = await DB.getInstance();
    await db.query('CALL reset_password_with_recovery_token(?, ?)', [
      token,          
      newPasswordHash
    ]);

    // 4) Success → 204 No Content
    return res.status(204).send();
  } catch (error: any) {

    if (error?.message?.includes('Invalid') || error?.message?.includes('expired')) {
      return res.status(401).json({ message: error.message });
    }

    // Fallback 
    return res.status(500).json({
      message: 'Failed to update password',
      error: error.message,
    });
  }
};
