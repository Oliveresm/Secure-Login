import { Request, Response } from 'express';
import handleRefreshToken from '../../../src/controllers/auth/refresh-token.controller';
import RefreshTokenService from '../../../src/services/validate-refresh-token.service';
import jwt from 'jsonwebtoken';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/services/validate-refresh-token.service');
vi.mock('jsonwebtoken');

describe('handleRefreshToken', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  const fakeUserId = 'user-uuid';
  const fakeAccessToken = 'new.jwt.token';

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should return 401 if no refreshToken is provided in cookies', async () => {
    mockReq.cookies = undefined;

    await handleRefreshToken(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Refresh token missing' });
  });

  it('should return accessToken if refresh token is valid', async () => {
    mockReq.cookies = { refresh_token: 'valid_token' };

    vi.spyOn(RefreshTokenService, 'validateRefreshToken').mockResolvedValue(fakeUserId);
    (jwt.sign as unknown as { mockReturnValue: (v: any) => void }).mockReturnValue(fakeAccessToken);

    await handleRefreshToken(mockReq as Request, mockRes as Response);

    expect(RefreshTokenService.validateRefreshToken).toHaveBeenCalledWith('valid_token');
    expect(mockRes.json).toHaveBeenCalledWith({ accessToken: fakeAccessToken });
  });

  it('should return 401 if token validation fails', async () => {
    mockReq.cookies = { refresh_token: 'invalid_token' };

    vi.spyOn(RefreshTokenService, 'validateRefreshToken').mockRejectedValue(
      new Error('Custom validation error')
    );

    await handleRefreshToken(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Custom validation error',
    });
  });
});
