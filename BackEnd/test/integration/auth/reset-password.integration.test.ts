import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../src/index';

import HashService from '../../../src/services/hash.service';
import DB from '../../../src/config/db';

// Mocks
vi.mock('../../src/services/hash.service');
vi.mock('../../src/config/db');

describe('Integration: POST /api/auth/reset-password', () => {
  const token = 'abc123token';
  const newPassword = 'MySecurePass1!';
  const hashed = 'hashed123!';

  const mockDb = { query: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(DB, 'getInstance').mockResolvedValue(mockDb as any);
  });

  it('should respond 204 when password reset is successful', async () => {
    vi.spyOn(HashService, 'hash').mockResolvedValue(hashed);
    mockDb.query.mockResolvedValue(undefined); // Simulate success

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, new_password: newPassword });

    expect(res.status).toBe(204);
    expect(HashService.hash).toHaveBeenCalledWith(newPassword);
    expect(mockDb.query).toHaveBeenCalledWith('CALL reset_password_with_recovery_token(?, ?)', [
      token,
      hashed,
    ]);
  });

  it('should respond 400 if input data is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({}); // empty

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid data' });
  });

  it('should respond 401 if token is invalid or expired', async () => {
    vi.spyOn(HashService, 'hash').mockResolvedValue(hashed);
    mockDb.query.mockRejectedValue(new Error('Token is invalid or expired'));

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, new_password: newPassword });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Token is invalid or expired' });
  });

  it('should respond 500 if hashing fails', async () => {
    vi.spyOn(HashService, 'hash').mockRejectedValue(new Error('Hash broken'));

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, new_password: newPassword });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'Failed to update password',
      error: 'Hash broken',
    });
  });
});
