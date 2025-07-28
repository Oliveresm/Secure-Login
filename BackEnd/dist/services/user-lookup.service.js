"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
/**
 * Retrieves a user from the database using the given email.
 *
 * @param email - The user's email address
 * @returns The user object if found, otherwise null
 */
const getUserByEmail = async (email) => {
    const db = await db_1.default.getInstance();
    const [rows] = await db.query('CALL get_user_by_email(?)', [email]);
    // For compatibility with MySQL and CALL, the result is usually nested
    const resultSet = rows[0];
    return resultSet.length > 0 ? resultSet[0] : null;
};
exports.default = {
    getUserByEmail,
};
