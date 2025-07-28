// test/unit/reset-password.controller.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleResetPassword } from '../../../src/controllers/auth/reset-password.controller';
import HashService from '../../../src/services/hash.service';
import DB from '../../../src/config/db';
import { Request, Response } from 'express';

vi.mock('../../src/services/hash.service');
vi.mock('../../src/config/db');

describe('handleResetPassword', () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    send: vi.fn(),
  } as unknown as Response;

  const token = 'valid_token';
  const newPassword = 'ValidPass123!';
  const hashedPassword = 'hashed_password';

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq.body = { token, new_password: newPassword };
  });

  it('should return 400 if the schema is invalid', async () => {
    mockReq.body = {}; // Missing fields

    await handleResetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid data' });
  });

  it('should return 204 if the reset is successful', async () => {
    vi.spyOn(HashService, 'hash').mockResolvedValue(hashedPassword);
    const mockQuery = vi.fn().mockResolvedValue(undefined);
    const mockDb = { query: mockQuery };
    vi.spyOn(DB, 'getInstance').mockResolvedValue(mockDb as any);

    await handleResetPassword(mockReq, mockRes);

    expect(HashService.hash).toHaveBeenCalledWith(newPassword);
    expect(mockQuery).toHaveBeenCalledWith('CALL reset_password_with_recovery_token(?, ?)', [
      token,
      hashedPassword,
    ]);
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('should return 401 if the token is invalid or expired', async () => {
    vi.spyOn(HashService, 'hash').mockResolvedValue(hashedPassword);
    const mockQuery = vi.fn().mockRejectedValue(new Error('Token is invalid or expired'));
    const mockDb = { query: mockQuery };
    vi.spyOn(DB, 'getInstance').mockResolvedValue(mockDb as any);

    await handleResetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token is invalid or expired' });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    vi.spyOn(HashService, 'hash').mockRejectedValue(new Error('Hash failed'));

    await handleResetPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Failed to update password',
      error: 'Hash failed',
    });
  });
});
