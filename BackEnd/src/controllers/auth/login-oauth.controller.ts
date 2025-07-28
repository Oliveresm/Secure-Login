// src/controllers/auth/login-oauth.controller.ts
import { Request, Response } from 'express';
import { verifyFirebaseToken } from '../../services/firebase.service';
import loginOauthRepository from '../../repository/auth/login-oauth.repository';

export const handleLoginOauth = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Missing idToken' });
  }

  try {
    const decoded = await verifyFirebaseToken(idToken);
    const email = decoded?.email;
    const uid   = decoded?.uid;

    if (!email || !uid) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    const { accessToken, refreshToken } = await loginOauthRepository.login(email, uid);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
    });
  } catch (error: any) {
    const msg = error.message ?? 'Login failed';

    const status =
      msg === 'User does not exist'     ? 404 :
      msg === 'Account is not verified' ? 401 :
      msg === 'Invalid OAuth token UID' ? 403 :
      401; // fallback

    console.error('[Login OAuth Error]', msg);

    return res.status(status).json({
      message: msg,
    });
  }
};
