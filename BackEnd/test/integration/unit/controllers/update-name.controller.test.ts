// tests/unit/controllers/update-name.controller.test.ts
import { Request, Response } from 'express';
import {
  vi,
  describe,
  beforeEach,
  it,
  expect,
  type Mock
} from 'vitest';

import { handleOauthUpdateName } from '../../../src/controllers/auth/oauth-update-name.controller';
import userLookupService from '../../../src/services/user-lookup.service';
import { updateDisplayName } from '../../../src/models/update-display-name.model';
import { verifyFirebaseToken } from '../../../src/services/firebase.service';

// ────────────────────────
// Pure - function mocks
// ────────────────────────
vi.mock('../../../src/services/firebase.service', () => ({
  verifyFirebaseToken: vi.fn(),
}));

vi.mock('../../../src/models/update-display-name.model', () => ({
  updateDisplayName: vi.fn(),
}));

/**
 * user-lookup.service is imported as **default**
 * in the production code, i.e.
 *   import userLookupService from '.../user-lookup.service'
 *
 * That default export is an object with a method
 * called `getUserByEmail`, so we mock it in exactly
 * the same shape ⤵
 */
vi.mock('../../../src/services/user-lookup.service', () => ({
  __esModule: true,
  default: {
    getUserByEmail: vi.fn(),
  },
}));

// ────────────────────────
// Test data / helpers
// ────────────────────────
const token = 'firebase-token';
const email = 'test@example.com';
const userId = 'user-id-123';
const newName = 'new_display';

const mockReq = {
  query: { token },
  body: { newName },
} as unknown as Request;

const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
  send: vi.fn(),
} as unknown as Response;

const clearResponseMocks = () => {
  (res.status as unknown as Mock).mockClear();
  (res.json  as unknown as Mock).mockClear();
  (res.send  as unknown as Mock).mockClear();
};


// ────────────────────────
// Test suite
// ────────────────────────
describe('handleOauthUpdateName controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearResponseMocks();
  });


  it('returns 400 if token or newName is missing', async () => {
    await handleOauthUpdateName({ query: {}, body: {} } as any, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameters' });
  });

  it('returns 400 if Firebase token has no e-mail', async () => {
    (verifyFirebaseToken as any).mockResolvedValue({});
    await handleOauthUpdateName(mockReq, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid Firebase token: no email found',
    });
  });

  it('returns 404 when user is not found in DB', async () => {
    (verifyFirebaseToken as any).mockResolvedValue({ email });
    (userLookupService.getUserByEmail as any).mockResolvedValue(null);

    await handleOauthUpdateName(mockReq, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('returns 204 on success', async () => {
    (verifyFirebaseToken as any).mockResolvedValue({ email });
    (userLookupService.getUserByEmail as any).mockResolvedValue({ id: userId });
    (updateDisplayName as any).mockResolvedValue(undefined);

    await handleOauthUpdateName(mockReq, res);

    expect(updateDisplayName).toHaveBeenCalledWith(userId, newName);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('returns 409 when display name is already taken', async () => {
    (verifyFirebaseToken as any).mockResolvedValue({ email });
    (userLookupService.getUserByEmail as any).mockResolvedValue({ id: userId });
    (updateDisplayName as any).mockRejectedValue(
      new Error('Display name is already taken'),
    );

    await handleOauthUpdateName(mockReq, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Display name is already taken',
    });
  });

  it('returns 500 on unexpected error', async () => {
    (verifyFirebaseToken as any).mockResolvedValue({ email });
    (userLookupService.getUserByEmail as any).mockResolvedValue({ id: userId });
    (updateDisplayName as any).mockRejectedValue(new Error('Unexpected DB error'));

    await handleOauthUpdateName(mockReq, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected DB error' });
  });
});
