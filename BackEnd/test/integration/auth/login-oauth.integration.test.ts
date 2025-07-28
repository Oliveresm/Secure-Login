/**
 * test/integration/auth/login-oauth.integration.test.ts
 */

import {
  describe,
  it,
  beforeEach,
  expect,
  vi,
  type Mock,
} from 'vitest';

/* ─── Mock jsonwebtoken ───────────────────────────────────────────────────── */
vi.mock('jsonwebtoken', () => {
  const sign = vi.fn();
  return {
    __esModule: true,
    sign,
    default: { sign },
  };
});

/* ─── Mock DB ─────────────────────────────────────────────────────────────── */
vi.mock('../../../src/config/db', () => {
  const query = vi.fn();
  const getInstance = vi.fn().mockResolvedValue({ query });
  return { __esModule: true, default: { getInstance } };
});

/* ─── Imports that receive mocks ──────────────────────────────────────────── */
import * as jwt          from 'jsonwebtoken';
import request           from 'supertest';
import app               from '../../../src/index';
import DB                from '../../../src/config/db'; // ← mocked above
import userLookupSvc     from '../../../src/services/user-lookup.service';
import * as firebaseSvc  from '../../../src/services/firebase.service';

/* ─── Fake data ───────────────────────────────────────────────────────────── */
const mockIdToken = 'mock.firebase.token';

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

const accessTokenMock  = 'integration-access-token';
const refreshTokenMock = 'integration-refresh-token';

/* ─── Suite ───────────────────────────────────────────────────────────────── */
describe('POST /api/auth/login/oauth (integration)', () => {
  let queryMock!: Mock;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Prepared DB mock
    const db = await DB.getInstance();
    queryMock = db.query as Mock;
    queryMock.mockReset();

    // Mock lookup: user already exists and is verified
    vi.spyOn(userLookupSvc, 'getUserByEmail')
      .mockResolvedValue(dbUser as any);

    // Mock Firebase: correctly decodes the idToken
    vi.spyOn(firebaseSvc, 'verifyFirebaseToken')
      .mockResolvedValue(decodedToken as any);

    // Mock JWT: access + refresh
    (jwt.sign as Mock)
      .mockImplementationOnce(() => accessTokenMock)   // access
      .mockImplementationOnce(() => refreshTokenMock); // refresh
  });

  it('should return 200 and store refreshToken', async () => {
    const res = await request(app)
      .post('/api/auth/login/oauth')
      .send({ idToken: mockIdToken })
      .expect(200);

    /* HTTP response */
    expect(res.body).toEqual({
      message: 'Login successful',
      accessToken: accessTokenMock,
    });

    /* Dependent interactions */
    expect(userLookupSvc.getUserByEmail)
      .toHaveBeenCalledWith('test@example.com');

    expect(jwt.sign).toHaveBeenCalledTimes(2);

    expect(queryMock).toHaveBeenCalledWith(
      'CALL store_refresh_token(?, ?)',
      [dbUser.id, refreshTokenMock],
    );
  });
});
