// src/repository/auth/login-local.repository.ts
import jwt from 'jsonwebtoken';
import HashService from '../../services/hash.service';
import UserLookupService from '../../services/user-lookup.service';
import DB from '../../config/db';

/**
 * Autentica a un usuario local usando email y contraseña.
 */
const login = async (
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken:string }> => {
  const db = await DB.getInstance();
  // Se elimina la dependencia del modelo 'User', usando 'any' en su lugar.
  const user: any = await UserLookupService.getUserByEmail(email);

  // 1. Verificar que el usuario existe, está verificado y es de tipo 'local'
  if (!user) {
    const err = new Error('User does not exist');
    (err as any).code = 'NOT_FOUND';
    throw err;
  }
  if (!user.is_verified) {
    const err = new Error('Account is not verified');
    (err as any).code = 'UNVERIFIED';
    throw err;
  }
  if (user.auth_type !== 'local') {
    const err = new Error('Authentication method is not valid for this account.');
    (err as any).code = 'WRONG_AUTH_TYPE';
    throw err;
  }

  // 2. Comparar la contraseña proporcionada con el hash almacenado
  const isPasswordValid = await HashService.compare(password, user.auth_hash);
  if (!isPasswordValid) {
    const err = new Error('Incorrect password');
    (err as any).code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // 3. Generar los tokens si las credenciales son válidas
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  // 4. Almacenar el nuevo refresh token
  await db.query('CALL store_refresh_token(?, ?)', [user.id, refreshToken]);

  return { accessToken, refreshToken };
};

export default {
  login,
};