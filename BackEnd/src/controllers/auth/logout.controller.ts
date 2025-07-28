// src/controllers/auth/logout.controller.ts
import { Request, Response } from 'express';
import LogoutService from '../../services/logout.service';

// src/interfaces/auth-payload.ts
export interface UserPayload {
    id: string;
    email: string;
}


const handleLogout = async (req: Request, res: Response) => {
    try {
        const userId = (req as Request & { user?: { id: string } }).user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: no user in request' });
        }

        // 1. eliminate refresh token from database
        await LogoutService.deleteRefreshToken(userId);

        // 2. clean cookie
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth/refreshToken',
        });

        return res.status(204).send(); // No Content
    } catch (error: any) {
        console.error('[Logout Error]', error.message);
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

export default handleLogout;
