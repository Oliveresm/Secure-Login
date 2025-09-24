import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleVerifyAccount } from '../../../src/controllers/auth/verify-account.controller';
import DB from '../../../src/config/db';
import hashService from '../../../src/services/hash.service';

vi.mock('../../../src/config/db');
vi.mock('../../../src/services/hash.service');

const mockReq = (token?: string) => ({
  query: { token },
}) as any;

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('handleVerifyAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if token is missing', async () => {
    const req = mockReq();
    const res = mockRes();

    await handleVerifyAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Verification token is missing.',
    });
  });

  it('returns 400 if no hash matches', async () => {
    const req = mockReq('fake-token');
    const res = mockRes();

    const mockConn = { query: vi.fn() };
    (DB.getInstance as any).mockResolvedValue(mockConn);

    const mockUsers = [
      { id: '1', out_hash: 'hash1' },
      { id: '2', out_hash: 'hash2' },
    ];

    mockConn.query.mockResolvedValue([mockUsers]);


    (hashService.compare as any).mockResolvedValue(false);

    await handleVerifyAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid verification link',
    });
  });

  it('verifies user if token matches hash', async () => {
    const req = mockReq('correct-token');
    const res = mockRes();

    const mockConn = { query: vi.fn() };
    (DB.getInstance as any).mockResolvedValue(mockConn);

    const mockUsers = [
      { id: 'abc123', out_hash: 'some-hash' },
    ];
    mockConn.query.mockResolvedValue([mockUsers]);


    (hashService.compare as any).mockResolvedValue(true);

    await handleVerifyAccount(req, res);

    expect(mockConn.query).toHaveBeenCalledWith(
      expect.stringContaining('SET is_verified'),
      ['abc123']
    );


    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User verified successfully',
    });
  });

  it('returns 500 on unexpected DB error', async () => {
    const req = mockReq('any-token');
    const res = mockRes();

    (DB.getInstance as any).mockRejectedValue(new Error('DB crash'));

    await handleVerifyAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error verifying account.',
      error: 'DB crash',
    });
  });
});
