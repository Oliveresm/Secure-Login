// src/controllers/user/get-me.controller.ts
import { Request, Response } from 'express';
import getUserById from '../../models/get-user-by-id.model';

export const handleGetMe = async (req: Request, res: Response) => {
    console.log('Handling GET /user/me request');
  try {
    const userId = (req as any).user.id;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { id, email, display_name, created_at } = user;
    res.json({ id, email, display_name, created_at });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
