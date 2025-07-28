// src/controllers/auth/oauth-update-name.controller.ts
import { Request, Response } from 'express';
import { updateDisplayName } from '../../models/update-display-name.model';
import userLookupService from '../../services/user-lookup.service';
import { verifyFirebaseToken } from '../../services/firebase.service';


export const handleOauthUpdateName = async (req: Request, res: Response) => {
  const { token } = req.query;
  const { newName } = req.body;

  if (!token || !newName) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  try {
    // 1. Verify token with Firebase
    const decoded = await verifyFirebaseToken(token as string);


    const userEmail = decoded.email;
    if (!userEmail) {
      return res.status(400).json({ message: 'Invalid Firebase token: no email found' });
    }

    // 2. Lookup user by email
    const dbUser = await userLookupService.getUserByEmail(userEmail);
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Call stored procedure
    await updateDisplayName(dbUser.id, newName);

    return res.status(204).send();
  } catch (error: any) {
    const msg = error.message || 'Failed to update display name';

    if (msg.includes('Display name is already taken')) {
      return res.status(409).json({ message: msg });
    }

    return res.status(500).json({ message: msg });
  }

};
