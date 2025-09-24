// test/unit/services/validate-refresh-token.service.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import DB from '../../../src/config/db';
import service from '../../../src/services/validate-refresh-token.service';

// Mock the DB module and its static getInstance method
vi.mock('../../../src/config/db', async () => {
  return {
    default: class {
      static getInstance = vi.fn();
    }
  };
});

describe('validateRefreshToken', () => {
  const mockDbInstance = {
    query: vi.fn()
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (DB.getInstance as any).mockResolvedValue(mockDbInstance);
  });

  it('returns user_id when the token is valid', async () => {
    const mockToken = 'valid-token';
    const mockUserId = 'user-123';

    mockDbInstance.query.mockResolvedValue([
      [[{ user_id: mockUserId }]],
    ]);

    const result = await service.validateRefreshToken(mockToken);

    expect(DB.getInstance).toHaveBeenCalled();
    expect(mockDbInstance.query).toHaveBeenCalledWith('CALL validate_refresh_token(?)', [mockToken]);
    expect(result).toBe(mockUserId);
  });

  it('throws an error if token is not found', async () => {
    const mockToken = 'invalid-token';

    mockDbInstance.query.mockResolvedValue([[]]); // Simulates empty result

    await expect(service.validateRefreshToken(mockToken))
      .rejects
      .toThrow('Refresh token not found');
  });

  it('throws an error if the DB query fails', async () => {
    const mockToken = 'any-token';

    mockDbInstance.query.mockRejectedValue(new Error('DB Error'));

    await expect(service.validateRefreshToken(mockToken))
      .rejects
      .toThrow('DB Error');
  });
});
