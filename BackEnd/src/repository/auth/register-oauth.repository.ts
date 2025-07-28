// src/repository/auth/register-oauth.repository.ts
import { verifyFirebaseToken } from '../../services/firebase.service';
import UserLookupService from '../../services/user-lookup.service';
import createUser from '../../models/create-user.model';
import crypto from 'crypto';

export const registerOAuth = async (
  idToken: string
): Promise<{ isNewUser: boolean }> => {
  const decoded = await verifyFirebaseToken(idToken);
  const email = decoded?.email;
  const uid   = decoded?.uid;

  if (!email || !uid) throw new Error('Invalid token payload');

  const existingUser = await UserLookupService.getUserByEmail(email);
  let isNewUser = false;

  if (!existingUser) {
    const tempDisplayName = crypto.randomUUID().replace(/-/g, '');

    try {
      await createUser({
        email,
        display_name: tempDisplayName,
        auth_type: 'oauth',
        auth_hash: uid,
        out_hash: null,
      });
      isNewUser = true;
    } catch (error: any) {
      if (error?.code === 'DUPLICATE') {
        const conflict = new Error('Email already exists') as any;
        conflict.code = 'DUPLICATE';
        throw conflict;
      }
      throw error;
    }
  } else {
    if (!existingUser.is_verified)
      throw new Error('Account is not verified');

    if (existingUser.auth_type !== 'oauth')
      throw new Error('User registered with another method');

    if (existingUser.auth_hash !== uid)
      throw new Error('Invalid OAuth token UID');
  }

  return { isNewUser };
};
