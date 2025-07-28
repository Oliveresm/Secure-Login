import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../../src/index';

describe('GET /api/auth/check (integration)', () => {
  const payload = {
    id: 'user-id-123',
    email: 'test@example.com',
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

  it('should return 401 if Authorization header is missing', async () => {
    const res = await request(app)
      .get('/api/auth/check')
      .expect(401);

    expect(res.body).toEqual({
      message: 'Missing or invalid Authorization header',
    });
  });

  it('should return 200 and payload if token is valid', async () => {
    const res = await request(app)
      .get('/api/auth/check')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual({
      message: 'Token is valid',
      payload: expect.objectContaining({
        id: payload.id,
        email: payload.email,
      }),
    });
  });

  it('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/auth/check')
      .set('Authorization', 'Bearer invalid.token')
      .expect(401);

    expect(res.body).toEqual({
      message: 'Invalid or expired token',
      error: expect.any(String),
    });
  });
});
