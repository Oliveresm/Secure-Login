import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleForgotPassword } from '../../../src/controllers/auth/forgot-password.controller';
import UserLookupService from '../../../src/services/user-lookup.service';
import HashService from '../../../src/services/hash.service';
import EmailService from '../../../src/services/email.service';
import DB from '../../../src/config/db';
import { Request, Response } from 'express';

// Mocks
vi.mock('../../../src/services/user-lookup.service');
vi.mock('../../../src/services/hash.service');
vi.mock('../../../src/services/email.service');
vi.mock('../../../src/config/db');

describe('handleForgotPassword', () => {
  const mockReq = {
    body: { email: 'test@example.com' }
  } as Request;

  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    send: vi.fn()
  } as unknown as Response;

  const mockDb = {
    query: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (DB.getInstance as any).mockResolvedValue(mockDb);
  });

  it('should return 204 if user does not exist', async () => {
    (UserLookupService.getUserByEmail as any).mockResolvedValue(null);

    await handleForgotPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('should generate token and send email if user exists', async () => {
    (UserLookupService.getUserByEmail as any).mockResolvedValue({ id: '123' });
    (HashService.generateToken as any).mockResolvedValue('secure-token');
    mockDb.query.mockResolvedValue(undefined);
    (EmailService.sendPasswordRecoveryEmail as any).mockResolvedValue(undefined);

    await handleForgotPassword(mockReq, mockRes);

    expect(HashService.generateToken).toHaveBeenCalled();
    expect(mockDb.query).toHaveBeenCalledWith(
      'CALL generate_expired_recovery_token(?, ?)',
      ['test@example.com', 'secure-token']
    );
    expect(EmailService.sendPasswordRecoveryEmail).toHaveBeenCalledWith(
      'test@example.com',
      'secure-token'
    );
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });
});
