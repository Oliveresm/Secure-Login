import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text value using bcrypt.
 * @param value - The plain text string to hash.
 * @returns A bcrypt hash of the input value.
 */
const hash = async (value: string): Promise<string> => {
  return await bcrypt.hash(value, SALT_ROUNDS);
};

/**
 * Compare a plain value with a hashed one.
 * @param plain - The plain text to compare.
 * @param hashed - The hashed value to compare against.
 * @returns True if both match, false otherwise.
 */
const compare = async (plain: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(plain, hashed);
};

/**
 * Generates a secure token by hashing a UUID.
 * Can be used for password recovery, email verification, etc.
 * @returns A hashed UUID string.
 */
const generateToken = async (): Promise<string> => {
  const raw = randomUUID(); // You can optionally prefix or timestamp this
  return await hash(raw);
};

export default {
  hash,
  compare,
  generateToken,
};
