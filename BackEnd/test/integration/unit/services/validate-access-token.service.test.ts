
import dotenv from 'dotenv';
dotenv.config();

import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import jwt from 'jsonwebtoken';
import { validateAccessToken } from '../../../src/services/validate-access-token.service';

vi.mock('jsonwebtoken');

describe('validateAccessToken', () => {
  const token = 'fake.jwt.token';

  it('should return valid: true and payload when token is valid', () => {
    const payloadMock = { id: 'user-id', email: 'test@example.com' };

    (jwt.verify as unknown as Mock).mockReturnValue(payloadMock);

    const result = validateAccessToken(token);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(result).toEqual({
      valid: true,
      payload: payloadMock,
    });
  });

  it('should return valid: false and error when token is invalid', () => {
    const errorMock = new Error('invalid token');

    (jwt.verify as unknown as Mock).mockImplementation(() => {
      throw errorMock;
    });

    const result = validateAccessToken(token);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(result).toEqual({
      valid: false,
      error: errorMock,
    });
  });
});
