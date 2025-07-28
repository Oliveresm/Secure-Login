import jwt from 'jsonwebtoken';

export function validateAccessToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const decoded = jwt.verify(token, secret);
    return { valid: true, payload: decoded };
  } catch (err) {
    return { valid: false, error: err };
  }
}
