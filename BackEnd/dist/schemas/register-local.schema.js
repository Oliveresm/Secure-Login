"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLocalSchema = void 0;
const zod_1 = require("zod");
exports.registerLocalSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    display_name: zod_1.z
        .string()
        .min(1, 'Display name is required')
        .max(50, 'Maximum 50 characters')
        .refine((val) => !/[<>]/.test(val), {
        message: 'Display name contains invalid characters',
    }),
    password: zod_1.z.string()
        .min(6, 'Must be at least 6 characters')
        .max(100, 'Too long')
        .regex(/[A-Z]/, 'Must include an uppercase letter')
        .regex(/[a-z]/, 'Must include a lowercase letter')
        .regex(/[0-9]/, 'Must include a number')
        .regex(/[^A-Za-z0-9]/, 'Must include a symbol'),
});
