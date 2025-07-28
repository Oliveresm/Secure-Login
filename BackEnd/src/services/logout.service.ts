// src/services/logout.service.ts
import DB from '../config/db';

const deleteRefreshToken = async (userId: string): Promise<void> => {
  const db = await DB.getInstance();
  await db.query('CALL delete_refresh_token(?)', [userId]);
};

export default {
  deleteRefreshToken,
};
