// tests/unit/repositories/login-local.repository.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import loginLocalRepository from '../../../src/repository/auth/login-local.repository';
import UserLookupService from '../../../src/services/user-lookup.service';
import HashService from '../../../src/services/hash.service';
import jwt from 'jsonwebtoken';
import DB from '../../../src/config/db';

vi.mock('../../../src/services/user-lookup.service');
vi.mock('../../../src/services/hash.service');
vi.mock('jsonwebtoken');
vi.mock('../../../src/config/db');

describe('loginLocalRepository.login', () => {
  const fakeUser = {
    id: 'user-123',
    email: 'test@example.com',
    auth_type: 'oauth',
    auth_hash: 'firebase-uid-123',
    is_verified: true,
  };

  const validUid = 'firebase-uid-123';
  const invalidUid = 'wrong-uid';
  const accessToken = 'ACCESS_TOKEN';
  const refreshToken = 'REFRESH_TOKEN';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should authenticate successfully and return tokens', async () => {
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue(fakeUser);
    vi.spyOn(HashService, 'compare').mockResolvedValue(true);
    vi.spyOn(jwt, 'sign' as any)
      .mockReturnValueOnce(accessToken)
      .mockReturnValueOnce(refreshToken);

    const mockQuery = vi.fn().mockResolvedValue(undefined);
    const mockDb = { query: mockQuery };
    vi.spyOn(DB, 'getInstance').mockResolvedValue(mockDb as any);

    const result = await loginLocalRepository.login(fakeUser.email, validUid);
    expect(result).toEqual({ accessToken, refreshToken });
  });

  it('should throw error if user does not exist', async () => {
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue(null);

    await expect(
      loginLocalRepository.login('unknown@example.com', validUid)
    ).rejects.toThrow('User does not exist');
  });

  it('should throw error if user is not verified', async () => {
    const unverifiedUser = { ...fakeUser, is_verified: false };
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue(unverifiedUser);

    await expect(
      loginLocalRepository.login(fakeUser.email, validUid)
    ).rejects.toThrow('Account is not verified');
  });

  it('should throw error if UID does not match', async () => {
    vi.spyOn(UserLookupService, 'getUserByEmail').mockResolvedValue(fakeUser);

    await expect(
      loginLocalRepository.login(fakeUser.email, invalidUid)
    ).rejects.toThrow('Invalid OAuth token UID');
  });
});
