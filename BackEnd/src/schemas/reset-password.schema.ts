// src/schemas/reset-password.schema.ts
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Invalid token'),
  new_password: z
    .string()
    .min(6, 'Must be at least 6 characters')
    .max(100, 'Too long')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a symbol')
    .refine((val) => !/[<>]/.test(val), {
      message: 'Password contains invalid characters',
    }),
});

export default resetPasswordSchema;
