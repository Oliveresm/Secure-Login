import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../../src/index';
import DB from '../../../src/config/db';
import crypto from 'crypto';

let connection: Awaited<ReturnType<typeof DB.getInstance>>;

describe('POST /api/auth/refreshToken', () => {
  const validToken = 'test-valid-refresh-token';
  const invalidToken = 'invalid-token';
  const userId = 'test-user-id'; // This test user will be inserted if it doesn't exist
  const tokenId = crypto.randomUUID();

  beforeAll(async () => {
    connection = await DB.getInstance();

    // Ensure the test user exists
    const [rows] = await connection.query('SELECT 1 FROM users WHERE id = ?', [userId]);
    if ((rows as any[]).length === 0) {
      await connection.query(
        `INSERT INTO users (id, email, display_name, is_verified, created_at)
         VALUES (?, 'test@example.com', 'TestUser', TRUE, NOW())`,
        [userId]
      );
    }

    // Insert a valid refresh token for the test user
    await connection.query(
      `INSERT INTO refresh_tokens (id, token, user_id, expires_at, created_at)
       VALUES (?, ?, ?, NOW() + INTERVAL 5 MINUTE, NOW())`,
      [tokenId, validToken, userId]
    );
  });

  afterAll(async () => {
    // Clean up the token and test user after tests
    await connection.query('DELETE FROM refresh_tokens WHERE id = ?', [tokenId]);
    await connection.query('DELETE FROM users WHERE id = ?', [userId]);
  });

  it('returns an accessToken when the refreshToken is valid', async () => {
    const res = await request(app)
      .post('/api/auth/refreshToken')
      .set('Cookie', [`refresh_token=${validToken}`]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(typeof res.body.accessToken).toBe('string');
  });

  it('returns 401 if refreshToken is missing', async () => {
    const res = await request(app)
      .post('/api/auth/refreshToken');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Refresh token missing');
  });

  it('returns 401 if refreshToken is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/refreshToken')
      .set('Cookie', [`refresh_token=${invalidToken}`]);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Refresh token not found');
  });
});
