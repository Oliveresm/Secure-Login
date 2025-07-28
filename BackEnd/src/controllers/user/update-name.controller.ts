// src/controllers/auth/update-name.controller.ts
import { Request, Response } from 'express';
import { updateDisplayName } from '../../models/update-display-name.model';

export const handleUpdateDisplayName = async (req: Request, res: Response) => {

  const userId = (req as any).user?.id;
  const { newName } = req.body;

  if (!userId || !newName) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  try {
    await updateDisplayName(userId, newName);
    return res.status(204).send();
  } catch (error: any) {
    const msg = error.message || 'Failed to update name';
    return res.status(500).json({ message: msg });
  }
};
