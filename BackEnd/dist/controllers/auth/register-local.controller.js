"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLocalRegister = void 0;
const register_local_repository_1 = __importDefault(require("../../repository/auth/register-local.repository"));
const register_local_schema_1 = require("../../schemas/register-local.schema");
const handleLocalRegister = async (req, res) => {
    try {
        // Validate the incoming request using Zod schema
        const parsed = register_local_schema_1.registerLocalSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Invalid data',
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const { email, display_name, password } = parsed.data;
        // Attempt to register the user in the database
        await register_local_repository_1.default.registerLocalUser({ email, display_name, password });
        // Successful registration (no content response)
        res.status(204).send();
    }
    catch (e) {
        // Internal error during registration
        res.status(500).json({
            message: 'Failed to register local user',
            error: e.message,
        });
    }
};
exports.handleLocalRegister = handleLocalRegister;
