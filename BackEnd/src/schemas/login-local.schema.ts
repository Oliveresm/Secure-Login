import { z } from 'zod';

export const loginLocalSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string()
    .min(6, 'Must be at least 6 characters')
    .max(100, 'Too long')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a symbol'),
});
