// src/controllers/auth/register-oauth.controller.ts
import { Request, Response } from 'express';
import { registerOAuth } from '../../repository/auth/register-oauth.repository';

export const handleRegisterOAuth = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Missing idToken' });
  }

  try {
    const { isNewUser } = await registerOAuth(idToken);

    return res.status(200).json({
      message: 'Register successful',
      isNewUser,
    });
  } catch (error: any) {
    const msg = error.message ?? 'Invalid or expired token';

    const status =
      msg === 'Invalid token payload'    ? 400 :
      msg === 'Email already exists'     ? 409 :
      msg === 'Invalid OAuth token UID'  ? 403 :
      msg === 'Account is not verified'  ? 401 :
      401; // Default fallback

    return res.status(status).json({ message: msg });
  }
};
