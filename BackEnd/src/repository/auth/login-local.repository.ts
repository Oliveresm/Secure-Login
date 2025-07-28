// src/repository/auth/login-local.repository.ts
import jwt from 'jsonwebtoken';
import HashService from '../../services/hash.service';
import UserLookupService from '../../services/user-lookup.service';
import DB from '../../config/db';

const login = async (
  email: string,
  uid: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const db = await DB.getInstance();
  const user = await UserLookupService.getUserByEmail(email);

  if (!user) {
    const err = new Error('User does not exist') as any;
    err.code = 'NOT_FOUND';
    throw err;
  }

  if (!user.is_verified) {
    const err = new Error('Account is not verified') as any;
    err.code = 'UNVERIFIED';
    throw err;
  }

  if (user.auth_type === 'local') {
    await db.query(
      `UPDATE users SET auth_type = 'oauth', auth_hash = ? WHERE email = ?`,
      [uid, email]
    );
    user.auth_type = 'oauth';
    user.auth_hash = uid;
  }

  if (user.auth_hash !== uid) {
    const err = new Error('Invalid OAuth token UID') as any;
    err.code = 'INVALID_UID';
    throw err;
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { Id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '1d' }
  );

  await db.query('CALL store_refresh_token(?, ?)', [user.id, refreshToken]);

  return { accessToken, refreshToken };
};


export default {
  login,
};
