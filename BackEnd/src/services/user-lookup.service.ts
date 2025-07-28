import DB from '../config/db';

/**
 * Retrieves a user from the database using the given email.
 * 
 * @param email - The user's email address
 * @returns The user object if found, otherwise null
 */
const getUserByEmail = async (email: string) => {
  const db = await DB.getInstance();

  const [rows] = await db.query('CALL get_user_by_email(?)', [email]);

  // For compatibility with MySQL and CALL, the result is usually nested
  const resultSet = (rows as any[][])[0];
  return resultSet.length > 0 ? resultSet[0] : null;
};

export default {
  getUserByEmail,
};
