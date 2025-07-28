"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/schemas/reset-password.schema.ts
const zod_1 = require("zod");
const resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(10, 'Invalid token'),
    new_password: zod_1.z
        .string()
        .min(8, 'Must be at least 8 characters')
        .refine((val) => !/[<>]/.test(val), {
        message: 'Password contains invalid characters',
    }),
});
exports.default = resetPasswordSchema;
