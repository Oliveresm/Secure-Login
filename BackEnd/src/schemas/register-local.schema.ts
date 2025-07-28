import { z } from 'zod';

export const registerLocalSchema = z.object({
  email: z.string().email('Invalid email'),
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Maximum 50 characters')
    .refine((val) => !/[<>]/.test(val), {
      message: 'Display name contains invalid characters',
    }),
  password: z.string()
    .min(6, 'Must be at least 6 characters')
    .max(100, 'Too long')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a symbol'),
});

export type RegisterLocalDTO = z.infer<typeof registerLocalSchema>;
