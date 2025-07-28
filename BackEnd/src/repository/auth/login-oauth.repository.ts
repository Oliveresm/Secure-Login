import jwt from 'jsonwebtoken';
import UserLookupService from '../../services/user-lookup.service';
import DB from '../../config/db';

const login = async (email: string, uid: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const db = await DB.getInstance();
  const user = await UserLookupService.getUserByEmail(email);

  if (!user) throw new Error('User does not exist');
  if (!user.is_verified) throw new Error('Account is not verified');

  if (user.auth_type === 'local') {
    console.warn('[OAuth] Overriding local account to OAuth for:', email);

    await db.query(`
      UPDATE users
      SET auth_type = 'oauth',
          auth_hash = ?
      WHERE email = ?
    `, [uid, email]);

    user.auth_type = 'oauth';
    user.auth_hash = uid;
  }

  if (user.auth_hash !== uid) throw new Error('Invalid OAuth token UID');

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '1d' }
  );

  await db.query('CALL store_refresh_token(?, ?)', [user.id, refreshToken]);

  return { accessToken, refreshToken };
};

export default {
  login,
};
