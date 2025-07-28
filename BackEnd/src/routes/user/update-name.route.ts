import { Router } from 'express';
import { handleUpdateDisplayName } from '../../controllers/user/update-name.controller';

const router = Router();

/**
 * @route   PATCH /auth/update-name
 * @desc    Allows an authenticated user to change their display_name
 * @access  Private (requires authentication middleware)
 */
router.patch('/', handleUpdateDisplayName);

export default router;
