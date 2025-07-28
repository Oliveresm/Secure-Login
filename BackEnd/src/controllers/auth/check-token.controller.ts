import { Request, Response } from 'express';
import { validateAccessToken } from '../../services/validate-access-token.service';

export async function handleCheckAccessToken(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { valid, payload, error } = validateAccessToken(token);

    if (!valid) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(401).json({ message: 'Invalid or expired token', error: errorMessage });

    }

    return res.status(200).json({ message: 'Token is valid', payload });
}
