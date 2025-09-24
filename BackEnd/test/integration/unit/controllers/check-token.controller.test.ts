import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleCheckAccessToken } from '../../../src/controllers/auth/check-token.controller';
import * as tokenService from '../../../src/services/validate-access-token.service';
import type { Request, Response } from 'express';

vi.mock('../../../src/services/validate-access-token.service');

describe('handleCheckAccessToken', () => {
  const mockStatus = vi.fn();
  const mockJson = vi.fn();
  const mockSend = vi.fn();

  const res = {
    status: mockStatus.mockReturnValue({ json: mockJson, send: mockSend }),
    json: mockJson,
    send: mockSend,
  } as unknown as Response;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if Authorization header is missing', async () => {
    const req = { headers: {} } as Request;

    await handleCheckAccessToken(req, res);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Missing or invalid Authorization header',
    });
  });

  it('should return 401 if token is invalid', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid.token',
      },
    } as Request;

    (tokenService.validateAccessToken as any).mockReturnValue({
      valid: false,
      error: new Error('jwt expired'),
    });

    await handleCheckAccessToken(req, res);

    expect(tokenService.validateAccessToken).toHaveBeenCalledWith('invalid.token');
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
      error: 'jwt expired',
    });
  });

  it('should return 200 and payload if token is valid', async () => {
    const req = {
      headers: {
        authorization: 'Bearer valid.token',
      },
    } as Request;

    const fakePayload = { id: 'user-id', email: 'test@example.com' };

    (tokenService.validateAccessToken as any).mockReturnValue({
      valid: true,
      payload: fakePayload,
    });

    await handleCheckAccessToken(req, res);

    expect(tokenService.validateAccessToken).toHaveBeenCalledWith('valid.token');
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Token is valid',
      payload: fakePayload,
    });
  });
});
