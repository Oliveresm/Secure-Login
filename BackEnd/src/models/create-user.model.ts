// src/models/create-user.model.ts
import DB from '../config/db';

interface CreateUserParams {
  email: string;
  display_name: string;
  auth_type: 'local' | 'oauth';
  auth_hash: string | null;
  out_hash: string | null;
}

const createUser = async ({
  email,
  display_name,
  auth_type,
  auth_hash,
  out_hash,
}: CreateUserParams): Promise<void> => {
  const db = await DB.getInstance();

  try {
    await db.query('CALL create_user(?, ?, ?, ?, ?)', [
      email,
      display_name,
      auth_type,
      auth_hash,
      out_hash,
    ]);
  } catch (error: any) {
    const msg = error.message || '';

    if (
      msg.includes('Email already exists') ||
      msg.includes('Display name already exists')
    ) {
      const conflictError = new Error(msg);
      (conflictError as any).code = 'DUPLICATE';
      throw conflictError;
    }

    throw error;
  }
};

export default createUser;
