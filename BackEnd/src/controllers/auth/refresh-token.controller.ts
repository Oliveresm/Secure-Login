// src/controllers/auth/refresh-token.controller.ts
import { Request, Response } from 'express';
import RefreshTokenService from '../../services/validate-refresh-token.service';
import jwt from 'jsonwebtoken';

const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    // 1. Read refresh token from secure cookie
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    // 2. Validate token and retrieve user ID
    const userId = await RefreshTokenService.validateRefreshToken(refreshToken);

    // 3. Generate a new short-lived access token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment');
    }

    const accessToken = jwt.sign({ userId }, secret, { expiresIn: '1h' });

    // 4. Return only the new access token (refresh token stays in cookie)
    return res.status(200).json({ accessToken });
  } catch (error: any) {
    console.error('[RefreshToken Error]', error.message);

    return res.status(401).json({
      message: error.message || 'Invalid or expired refresh token',
    });
  }
};

export default handleRefreshToken;
