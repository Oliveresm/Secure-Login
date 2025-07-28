import { Router } from 'express';
import updateNameRoutes from './user/update-name.route';
import getMeRoute from './user/get-me.route';

const router = Router();

/**
 * PATCH /user/update-name
 * Allows an authenticated user to change their display_name.
 * Expects: { newName } in the body.
 * Returns 204 No Content on success.
 */
router.use('/update-name', updateNameRoutes);

/**
 * GET /user/me
 * Returns the current user's info based on the access token.
 */
router.use('/me', getMeRoute);
export default router;