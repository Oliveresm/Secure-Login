// tests/integration/auth/update-name-oauth.integration.test.ts
import request from 'supertest';
import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';

import app from '../../../src/index';

// ────────────────────────────────────────────────────────────
// Mocks
// ────────────────────────────────────────────────────────────
import * as model               from '../../../src/models/update-display-name.model';
import * as firebaseService     from '../../../src/services/firebase.service';
import userLookupService from '../../../src/services/user-lookup.service';

vi.mock('../../../src/models/update-display-name.model');
vi.mock('../../../src/services/firebase.service');
vi.mock('../../../src/services/user-lookup.service');

// common stub data
const token      = 'FAKE_ID_TOKEN';
const email      = 'user@example.com';
const userId     = 'user-id-123';
const decodedTok = { email };

beforeAll(() => {
  // Successful defaults
  (firebaseService.verifyFirebaseToken as unknown as Mock)
    .mockResolvedValue(decodedTok);

  (userLookupService.getUserByEmail as unknown as Mock)
    .mockResolvedValue({ id: userId, email });

  (model.updateDisplayName as unknown as Mock)
    .mockResolvedValue(undefined);
});

afterAll(() => vi.restoreAllMocks());

beforeEach(() => {
  vi.clearAllMocks();
});

// ────────────────────────────────────────────────────────────
// Tests
// ────────────────────────────────────────────────────────────
describe('PATCH /auth/update-name/oauth', () => {
  const endpoint = '/api/auth/update-name/oauth';

  it('returns 204 when display name is updated successfully', async () => {
    const res = await request(app)
      .patch(`${endpoint}?token=${token}`)
      .send({ newName: 'TempName' });

    expect(res.status).toBe(204);
    expect(model.updateDisplayName).toHaveBeenCalledWith(userId, 'TempName');
  });

  it('returns 400 when parameters are missing', async () => {
    const res = await request(app)
      .patch(`${endpoint}?token=${token}`)
      .send({});                                 
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing parameters');
  });

  it('returns 409 when duplicate display name error occurs', async () => {
    (model.updateDisplayName as unknown as Mock)
      .mockRejectedValueOnce(new Error('Display name is already taken'));

    const res = await request(app)
      .patch(`${endpoint}?token=${token}`)
      .send({ newName: 'ExistingName' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Display name is already taken');
  });

  it('returns 500 on unexpected model error', async () => {
    (model.updateDisplayName as unknown as Mock)
      .mockRejectedValueOnce(new Error('DB failure'));

    const res = await request(app)
      .patch(`${endpoint}?token=${token}`)
      .send({ newName: 'Whatever' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('DB failure');
  });
});
