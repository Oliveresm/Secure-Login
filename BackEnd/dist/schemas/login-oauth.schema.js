"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginOAuthSchema = void 0;
const zod_1 = require("zod");
exports.loginOAuthSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    uid: zod_1.z.string().min(1),
});
