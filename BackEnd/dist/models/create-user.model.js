"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/create-user.model.ts
const db_1 = __importDefault(require("../config/db"));
// This function inserts a new user into the database using a stored procedure.
// The procedure 'create_user' is expected to handle logic such as verification status, expiration, etc.
const createUser = async ({ email, display_name, auth_type, auth_hash, out_hash, }) => {
    const db = await db_1.default.getInstance();
    await db.query('CALL create_user(?, ?, ?, ?, ?)', [
        email,
        display_name,
        auth_type,
        auth_hash,
        out_hash,
    ]);
};
exports.default = createUser;
