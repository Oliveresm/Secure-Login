import { describe, it, expect, vi, beforeEach } from 'vitest';
import admin from 'firebase-admin';
import { verifyFirebaseToken } from '../../../src/services/firebase.service';

vi.mock('firebase-admin', () => {
  const verifyIdToken = vi.fn();
  const auth = vi.fn(() => ({ verifyIdToken }));

  return {
    default: {
      apps: [],
      initializeApp: vi.fn(),
      credential: {
        cert: vi.fn(),
      },
      auth,
    },
  };
});

describe('verifyFirebaseToken', () => {
  const mockPayload = {
    uid: 'firebase-uid',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should verify token and return decoded payload', async () => {
    const mockVerify = admin.auth().verifyIdToken as unknown as ReturnType<typeof vi.fn>;
    mockVerify.mockResolvedValue(mockPayload);

    const result = await verifyFirebaseToken('valid-id-token');

    expect(admin.auth).toHaveBeenCalled();
    expect(mockVerify).toHaveBeenCalledWith('valid-id-token');
    expect(result).toEqual(mockPayload);
  });

  it('should throw error if verification fails', async () => {
    const mockVerify = admin.auth().verifyIdToken as unknown as ReturnType<typeof vi.fn>;
    const error = new Error('invalid token');
    mockVerify.mockRejectedValue(error);

    await expect(verifyFirebaseToken('bad-token')).rejects.toThrow('invalid token');
  });
});
