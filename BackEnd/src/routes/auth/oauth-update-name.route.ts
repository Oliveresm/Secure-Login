import { Router } from 'express';
import { handleOauthUpdateName } from '../../controllers/auth/oauth-update-name.controller';

const router = Router();

/**
 * @route   PATCH /auth/update-name/oauth
 * @desc    Update the user's display_name right after OAuth registration
 * @access  Public  (the idToken is already validated in the previous step)
 */
router.patch('/', handleOauthUpdateName);

export default router;
