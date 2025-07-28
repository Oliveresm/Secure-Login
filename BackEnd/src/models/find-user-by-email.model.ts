import DB from '../config/db';

interface FoundUser {
  id: string;
  email: string;
  display_name: string;
  auth_type: string;
  auth_hash: string;
  is_verified: boolean;
}

export default async function findUserByEmail(email: string): Promise<FoundUser | null> {
  const db = await DB.getInstance();

  const [rows] = await db.query('CALL get_user_by_email(?)', [email]);

  const userList = (rows as any[][])[0];
  const user = userList?.[0];

  return user || null;
}
