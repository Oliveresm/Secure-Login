// src/controllers/auth/register-local.controller.ts
import { Request, Response } from 'express';
import userRepo from '../../repository/auth/register-local.repository';
import { registerLocalSchema } from '../../schemas/register-local.schema';

export const handleLocalRegister = async (req: Request, res: Response) => {
  try {
    // Validate the incoming request using Zod schema
    const parsed = registerLocalSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid data',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, display_name, password } = parsed.data;

    // Attempt to register the user in the database
    await userRepo.registerLocalUser({ email, display_name, password });

    // Successful registration
    res.status(204).send();
  } catch (e: any) {
    // Conflict: email or display_name duplicated
    if (e.code === 'DUPLICATE') {
      return res.status(409).json({
        message: e.message,
      });
    }

    // Any other unexpected error
    res.status(500).json({
      message: 'Failed to register local user',
      error: e.message,
    });
  }
};
