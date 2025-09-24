// test/unit/services/hash.service.test.ts
import { describe, it, expect } from 'vitest';
import hashService from '../../../src/services/hash.service';

describe('hashService', () => {
  // This test verifies that the password is hashed and can be validated correctly
  it('should correctly hash and validate a password', async () => {
    const password = 'superSecret123';
    const hashed = await hashService.hash(password);

    // Ensure that the hashed password is different from the original
    expect(hashed).not.toBe(password);

    // Ensure that the comparison returns true for the original password
    const isValid = await hashService.compare(password, hashed);
    expect(isValid).toBe(true);
  });

  // This test checks that the generateToken method returns a valid string token
  it('should generate a secure token', async () => {
    const token = await hashService.generateToken();

    // It should be a string and reasonably long
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);
  });
});

