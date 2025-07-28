import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../../src/index';
import DB from '../../../src/config/db';

describe('POST /api/auth/register/local (integration)', () => {
  it('should register a local user and clean up the DB afterwards', async () => {
    const db = await DB.getInstance();

    const timestamp = Date.now();
    const email = `testuser+${timestamp}@example.com`; // <-- unique email for each test
    const display_name = `TestUser${timestamp}`;
    const password = 'SecurePass1!';

    const res = await request(app)
      .post('/api/auth/register/local')
      .send({ email, display_name, password });

    expect(res.status).toBe(204); // or 201 if you change the implementation
    // expect(res.body.message).toBe('User created');

    const [cleanupResult] = await db.query('DELETE FROM users WHERE email = ?', [email]);
    expect(cleanupResult).toBeDefined();
  });

});
