"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/validate-refresh-token.service.ts
const db_1 = __importDefault(require("../config/db"));
/**
 * Validates a refresh token by calling a stored procedure.
 * If valid, returns the user ID associated with it.
 * @param refreshToken The refresh token to validate
 * @returns The user ID associated with the valid refresh token
 * @throws Error if the token is not found or the DB query fails
 */
const validateRefreshToken = async (refreshToken) => {
    const db = await db_1.default.getInstance();
    try {
        const [rows] = await db.query('CALL validate_refresh_token(?)', [refreshToken]);
        const resultSet = rows?.[0] ?? [];
        if (!Array.isArray(resultSet) || resultSet.length === 0) {
            // Token not found in DB
            throw new Error('Refresh token not found');
        }
        // Return the user ID from the first result
        return resultSet[0].user_id;
    }
    catch (error) {
        // Propagate error to caller
        throw error;
    }
};
exports.default = {
    validateRefreshToken,
};
