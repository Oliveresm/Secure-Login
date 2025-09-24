import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerOAuth } from '../../../src/repository/auth/register-oauth.repository';
import * as firebaseService from '../../../src/services/firebase.service';
import userService from '../../../src/services/user-lookup.service';
import * as createUserModel from '../../../src/models/create-user.model';

vi.mock('../../../src/services/firebase.service');
vi.mock('../../../src/services/user-lookup.service');
vi.mock('../../../src/models/create-user.model');

describe('registerOAuth', () => {
  const idToken = 'fake-id-token';
  const decodedToken = {
    email: 'user@example.com',
    uid: 'firebase-uid-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(firebaseService, 'verifyFirebaseToken').mockResolvedValue(decodedToken as any);
  });

  it('should register a new user and return isNewUser=true', async () => {
    vi.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);
    vi.spyOn(createUserModel, 'default').mockResolvedValue(undefined);

    const result = await registerOAuth(idToken);

    expect(createUserModel.default).toHaveBeenCalled();
    expect(result).toHaveProperty('isNewUser', true);
  });

  it('should login existing user and return isNewUser=false', async () => {
    const existingUser = {
      id: 'user-id',
      email: decodedToken.email,
      auth_hash: decodedToken.uid,
      auth_type: 'oauth',
      is_verified: true,
    };

    vi.spyOn(userService, 'getUserByEmail').mockResolvedValue(existingUser);

    const result = await registerOAuth(idToken);

    expect(result).toEqual({ isNewUser: false });
  });

  it('should throw error if existing user is not verified', async () => {
    const existingUser = {
      id: 'user-id',
      email: decodedToken.email,
      auth_hash: decodedToken.uid,
      auth_type: 'oauth',
      is_verified: false,
    };

    vi.spyOn(userService, 'getUserByEmail').mockResolvedValue(existingUser);

    await expect(registerOAuth(idToken)).rejects.toThrow('Account is not verified');
  });

  it('should throw error if auth type is not oauth', async () => {
    const existingUser = {
      id: 'user-id',
      email: decodedToken.email,
      auth_hash: decodedToken.uid,
      auth_type: 'local',
      is_verified: true,
    };

    vi.spyOn(userService, 'getUserByEmail').mockResolvedValue(existingUser);

    await expect(registerOAuth(idToken)).rejects.toThrow('User registered with another method');
  });

  it('should throw error if uid does not match', async () => {
    const existingUser = {
      id: 'user-id',
      email: decodedToken.email,
      auth_hash: 'another-uid',
      auth_type: 'oauth',
      is_verified: true,
    };

    vi.spyOn(userService, 'getUserByEmail').mockResolvedValue(existingUser);

    await expect(registerOAuth(idToken)).rejects.toThrow('Invalid OAuth token UID');
  });
});
