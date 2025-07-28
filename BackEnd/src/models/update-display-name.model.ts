// src/models/user-update.service.ts
import DB from '../config/db';

export const updateDisplayName = async (userId: string, newName: string) => {
  const db = await DB.getInstance();

  await db.query('CALL update_user_display_name(?, ?)', [userId, newName]);
};
