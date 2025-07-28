// src/controllers/auth/login-local.controller.ts
import { Request, Response } from 'express';
import loginLocalRepository from '../../repository/auth/login-local.repository';

export const handleLoginLocal = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const { accessToken, refreshToken } = await loginLocalRepository.login(email, password);

    // 1. set refresh token in cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    });

    // 2. return access token in response
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
    });
  } catch (error: any) {
    const msg = error.message;

    const status =
      msg === 'User does not exist'      ? 404 :
      msg === 'Incorrect password'       ? 401 :
      msg === 'Account is not verified'  ? 403 :
      401; // fallback

    return res.status(status).json({ message: msg });
  }
};
