// test/integration/forgot-password.integration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../src/index';
import UserLookupService from '../../../src/services/user-lookup.service';
import HashService from '../../../src/services/hash.service';
import EmailService from '../../../src/services/email.service';
import DB from '../../../src/config/db';

// Mocks for all dependencies
vi.mock('../../../src/services/user-lookup.service');
vi.mock('../../../src/services/hash.service');
vi.mock('../../../src/services/email.service');
vi.mock('../../../src/config/db');

describe('Integration: POST /api/auth/forgot-password', () => {
  const email = 'test@example.com';
  const mockDb = { query: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(DB, 'getInstance').mockResolvedValue(mockDb as any);
  });

  it('responds with 204 if the email does NOT exist (silent exit)', async () => {
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email });

    expect(res.status).toBe(204);
    expect(UserLookupService.getUserByEmail).toHaveBeenCalledWith(email);
    expect(mockDb.query).not.toHaveBeenCalled();
    expect(EmailService.sendPasswordRecoveryEmail).not.toHaveBeenCalled();
  });

  it('generates a token, stores it, and sends email when the email exists', async () => {
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue({ id: 'uuid-123' });
    vi.spyOn(HashService, 'generateToken').mockResolvedValue('secure-token');
    mockDb.query.mockResolvedValue(undefined);
    vi.spyOn(EmailService, 'sendPasswordRecoveryEmail').mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email });

    expect(res.status).toBe(204);
    expect(HashService.generateToken).toHaveBeenCalled();
    expect(mockDb.query).toHaveBeenCalledWith(
      'CALL generate_expired_recovery_token(?, ?)',
      [email, 'secure-token'],
    );
    expect(EmailService.sendPasswordRecoveryEmail).toHaveBeenCalledWith(email, 'secure-token');
  });
});
