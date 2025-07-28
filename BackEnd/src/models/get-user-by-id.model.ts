// src/models/get-user-by-id.model.ts
import DB from '../config/db';

interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

const getUserById = async (id: string): Promise<User | null> => {
  const db = await DB.getInstance();
  const [rows] = await db.query(
    'SELECT id, email, display_name, created_at FROM users WHERE id = ?',
    [id]
  );

  return Array.isArray(rows) && rows[0] ? rows[0] as User : null;
};

export default getUserById;
