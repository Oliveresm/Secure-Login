// tests/unit/models/update-display-name.model.test.ts
import { vi, describe, beforeEach, it, expect } from 'vitest';
import{ updateDisplayName } from '../../../src/models/update-display-name.model';
import DB from '../../../src/config/db';

vi.mock('../../../src/config/db');

describe('updateDisplayName model', () => {
  const mockQuery = vi.fn();
  const mockDbInstance = { query: mockQuery };

  beforeEach(() => {
    mockQuery.mockReset();
    (DB.getInstance as any).mockResolvedValue(mockDbInstance);
  });

  it('should call the stored procedure with correct parameters', async () => {
    await updateDisplayName('user-id-123', 'new_name');
    expect(mockQuery).toHaveBeenCalledWith('CALL update_user_display_name(?, ?)', [
      'user-id-123',
      'new_name',
    ]);
  });

  it('should propagate database errors', async () => {
    mockQuery.mockRejectedValue(new Error('DB error'));
    await expect(updateDisplayName('user-id-123', 'new_name')).rejects.toThrow('DB error');
  });
});
