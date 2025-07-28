import { z } from 'zod';

export const loginOAuthSchema = z.object({
  email: z.string().email(),
  uid: z.string().min(1),
});
