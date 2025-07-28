// test/integration/auth/register-oauth.integration.test.ts
import {
  vi,
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  type Mock,
} from 'vitest';

import request from 'supertest';
import app from '../../../src/index';

import * as userLookup from '../../../src/services/user-lookup.service';
import * as firebaseService from '../../../src/services/firebase.service';
import * as createUserModel from '../../../src/models/create-user.model';
import type { DecodedIdToken } from 'firebase-admin/auth';

// ---------------------------------------------------------------------------
// Mocks that must exist before loading the app
// ---------------------------------------------------------------------------
vi.mock('../../../src/config/db', () => ({
  default: {
    getInstance: vi.fn().mockResolvedValue({
      query: vi.fn().mockResolvedValue([[], []]), // any CALL returns empty
    }),
  },
}));

vi.mock('../../../src/services/user-lookup.service', () => ({
  default: {
    getUserByEmail: vi.fn().mockResolvedValue(null), // default: does not exist
  },
}));

// ---------------------------------------------------------------------------
// Simulated data
// ---------------------------------------------------------------------------
const mockIdToken = 'mock.firebase.token';

const mockDecodedToken: DecodedIdToken = {
  email: 'testuser@example.com',
  name: 'Test User',
  uid: 'firebase-uid-123',
  aud: '', auth_time: 0, exp: 0, iat: 0, iss: '', sub: '',
  user_id: 'firebase-uid-123',
  firebase: { sign_in_provider: '', identities: {} },
};

// ---------------------------------------------------------------------------
// Global mock setup
// ---------------------------------------------------------------------------
beforeAll(() => {
  // Environment variables to generate JWT (even though not returned to client)
  process.env.JWT_SECRET = 'test_jwt_secret';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';

  // 1st call → user does not exist, 2nd call → newly created user
  const getUserByEmailMock = userLookup.default
    .getUserByEmail as unknown as Mock;

  getUserByEmailMock
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce({
      id: 'new-user-id',
      email: mockDecodedToken.email,
      auth_type: 'oauth',
      auth_hash: mockDecodedToken.uid,
      is_verified: true,
    });

  vi.spyOn(firebaseService, 'verifyFirebaseToken')
    .mockResolvedValue(mockDecodedToken);

  vi.spyOn(createUserModel, 'default').mockResolvedValue(undefined);
});

afterAll(() => vi.restoreAllMocks());

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('POST /auth/register/oauth', () => {
  it('should register a new user with a Firebase ID token', async () => {
    const res = await request(app)
      .post('/api/auth/register/oauth')
      .send({ idToken: mockIdToken });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Register successful',
      isNewUser: true,
    });
  });

  it('should return 400 if idToken is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register/oauth')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing idToken');
  });

  it('should return 400 if decoded token lacks email or uid', async () => {
    (firebaseService.verifyFirebaseToken as unknown as Mock).mockResolvedValue({
      name: 'Fake User',
    } as Partial<DecodedIdToken> as DecodedIdToken);

    const res = await request(app)
      .post('/api/auth/register/oauth')
      .send({ idToken: mockIdToken });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid token payload');
  });
});
