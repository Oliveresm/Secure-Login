// test/unit/repositories/login-oauth.repository.test.ts
import { describe, it, beforeEach, expect, vi, Mock } from 'vitest';

/* ──────────── Required mocks ──────────── */
vi.mock('../../../src/services/firebase.service');
vi.mock('../../../src/services/user-lookup.service');
vi.mock('../../../src/config/db');

/* ──────────── SUT import ──────────── */
import loginOAuthRepo        from '../../../src/repository/auth/login-oauth.repository';
import * as firebaseService  from '../../../src/services/firebase.service';
import userLookupService     from '../../../src/services/user-lookup.service';
import DB                    from '../../../src/config/db';

describe('loginOAuthRepository.login', () => {
  /* Stub data */
  const decodedToken = {
    email: 'test@example.com',
    name:  'Test User',
    uid:   'firebase-uid-123',
  };

  const dbUser = {
    id:           'user-id-123',
    email:        'test@example.com',
    display_name: 'Test User',
    auth_type:    'oauth',
    auth_hash:    'firebase-uid-123',
    is_verified:  true,
  };

  beforeEach(() => vi.clearAllMocks());

  it('should validate user, generate tokens and store refreshToken', async () => {
    /* 1 verifyFirebaseToken */
    (vi.mocked(firebaseService).verifyFirebaseToken as Mock)
      .mockResolvedValue(decodedToken as any);

    /* 2 getUserByEmail */
    (vi.mocked(userLookupService).getUserByEmail as Mock)
      .mockResolvedValue(dbUser as any);

    /* 3 DB query */
    const mockQuery = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(DB, 'getInstance').mockResolvedValue({ query: mockQuery } as any);

    /* 4 Execution */
    const result = await loginOAuthRepo.login(decodedToken.email, decodedToken.uid);

    /* 5 Assertions */
    expect(userLookupService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual({
      accessToken:  expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(mockQuery).toHaveBeenCalledWith(
      'CALL store_refresh_token(?, ?)',
      [dbUser.id, result.refreshToken],
    );
  });
});
