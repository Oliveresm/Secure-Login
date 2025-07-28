// test/unit/services/user-lookup.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import DB from '../../../src/config/db';
import userLookup from '../../../src/services/user-lookup.service';

// Mock the DB connection module
vi.mock('../../../src/config/db');

describe('UserLookupService', () => {
  // This test should return a user if it exists in the database
  it('should return a user if found in the database', async () => {
    const mockUser = {
      id: 'uuid-test',
      email: 'test@example.com',
      display_name: 'TestUser',
      is_verified: 1,
    };

    const mockConn = {
      query: vi.fn().mockResolvedValue([[[mockUser]]]), // double array due to CALL syntax
    };
    (DB.getInstance as any).mockResolvedValue(mockConn);

    const result = await userLookup.getUserByEmail('test@example.com');
    expect(result).toEqual(mockUser);
  });

  // This test should return null if the user does not exist
  it('should return null if user is not found', async () => {
    const mockConn = {
      query: vi.fn().mockResolvedValue([[[]]]), // no results
    };
    (DB.getInstance as any).mockResolvedValue(mockConn);

    const result = await userLookup.getUserByEmail('noexist@example.com');
    expect(result).toBeNull();
  });
});
