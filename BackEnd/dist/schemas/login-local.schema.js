"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLocalSchema = void 0;
const zod_1 = require("zod");
exports.loginLocalSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email' }),
    password: zod_1.z.string()
        .min(6, 'Must be at least 6 characters')
        .max(100, 'Too long')
        .regex(/[A-Z]/, 'Must include an uppercase letter')
        .regex(/[a-z]/, 'Must include a lowercase letter')
        .regex(/[0-9]/, 'Must include a number')
        .regex(/[^A-Za-z0-9]/, 'Must include a symbol'),
});
