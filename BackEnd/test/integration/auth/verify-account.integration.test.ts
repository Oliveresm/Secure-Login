// test/integration/auth/verify-account.integration.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import DB from '../../../src/config/db';
import app from '../../../src/index';
import hashService from '../../../src/services/hash.service';

describe('GET /api/auth/verify (account verification)', () => {
  it('verifies a user successfully with a valid token', async () => {
    const db = await DB.getInstance();

    const timestamp = Date.now();
    const raw_token = 'test-token-' + timestamp;
    const out_hash = await hashService.hash(raw_token);

    const email = `verifytest_${timestamp}@example.com`;
    const display_name = `VerifyTester_${timestamp}`;
    const auth_hash = await hashService.hash('123456');

    await db.query('CALL create_user(?, ?, ?, ?, ?)', [
      email,
      display_name,
      'local',
      auth_hash,
      out_hash,
    ]);

    const res = await request(app)
      .get('/api/auth/verify')
      .query({ token: raw_token });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User verified successfully');


    const [rows]: any = await db.query(
      'SELECT is_verified FROM users WHERE email = ?',
      [email]
    );
    expect(rows[0]?.is_verified).toBe(1);

    // Cleanup
    await db.query('DELETE FROM users WHERE email = ?', [email]);
  });
});
