import { describe, it, expect, vi, beforeEach } from 'vitest';
import loginLocalRepository from '../../../src/repository/auth/login-local.repository';
import UserLookupService from '../../../src/services/user-lookup.service';
import DB from '../../../src/config/db';
import jwt from 'jsonwebtoken';

vi.mock('../../../src/services/user-lookup.service');
vi.mock('../../../src/config/db');
vi.mock('jsonwebtoken');

const accessTokenMock = 'fakeAccessToken';
const refreshTokenMock = 'fakeRefreshToken';

describe('loginLocalRepository.login', () => {
  const fakeUser = {
    id: 'uuid-user-123',
    email: 'user@example.com',
    auth_type: 'oauth',
    auth_hash: 'firebase-uid-123',
    is_verified: true,
  };

  const validUid = 'firebase-uid-123';
  const invalidUid = 'wrong-uid';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(jwt, 'sign' as any)
      .mockReturnValueOnce(accessTokenMock)
      .mockReturnValueOnce(refreshTokenMock);
  });

  it('should authenticate successfully and return tokens', async () => {
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue(fakeUser);

    const mockQuery = vi.fn().mockResolvedValue(undefined);
    const mockDb = { query: mockQuery };
    vi.spyOn(DB, 'getInstance').mockResolvedValue(mockDb as any);

    const result = await loginLocalRepository.login(fakeUser.email, validUid);

    expect(result).toEqual({
      accessToken: accessTokenMock,
      refreshToken: refreshTokenMock,
    });

    expect(UserLookupService.getUserByEmail).toHaveBeenCalledWith(fakeUser.email);
    expect(mockQuery).toHaveBeenCalledWith('CALL store_refresh_token(?, ?)', [
      fakeUser.id,
      refreshTokenMock,
    ]);
  });

  it('should throw error if UID does not match', async () => {
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue(fakeUser);

    await expect(
      loginLocalRepository.login(fakeUser.email, invalidUid)
    ).rejects.toThrow('Invalid OAuth token UID');
  });

  it('should throw error if account is not verified', async () => {
    const unverifiedUser = { ...fakeUser, is_verified: false };
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue(unverifiedUser);

    await expect(
      loginLocalRepository.login(fakeUser.email, validUid)
    ).rejects.toThrow('Account is not verified');
  });

  it('should throw error if user does not exist', async () => {
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue(null);

    await expect(
      loginLocalRepository.login(fakeUser.email, validUid)
    ).rejects.toThrow('User does not exist');
  });
});
