import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import DB from '../../config/db';
import hashService from '../../services/hash.service';

interface UnverifiedUserRow extends RowDataPacket {
  id: string;
  out_hash: string;
}

export const handleVerifyAccount = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is missing.' });
  }

  try {
    const conn = await DB.getInstance();

    // Get all unverified users with non-null out_hash
    const [rows] = await conn.query<UnverifiedUserRow[]>(
      `SELECT id, out_hash
         FROM users
        WHERE is_verified = FALSE
          AND out_hash IS NOT NULL`
    );

    let matchedUser: UnverifiedUserRow | null = null;

    // Compare hash
    for (const user of rows) {
      const isMatch = await hashService.compare(token, user.out_hash);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(400).json({ message: 'Invalid verification link' });
    }

    // Update user directly
    await conn.query(
      `UPDATE users
          SET is_verified         = TRUE,
              out_hash            = NULL,
              out_hash_expires_at = NULL
        WHERE id = ?`,
      [matchedUser.id]
    );

    return res.status(200).json({ message: 'User verified successfully' });
  } catch (e: any) {
    console.error('Error in verify endpoint:', e);
    return res.status(500).json({
      message: 'Error verifying account.',
      error: e.message,
    });
  }
};

export default { handleVerifyAccount };
