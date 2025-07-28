"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const SALT_ROUNDS = 10;
/**
 * Hash a plain text value using bcrypt.
 * @param value - The plain text string to hash.
 * @returns A bcrypt hash of the input value.
 */
const hash = async (value) => {
    return await bcrypt_1.default.hash(value, SALT_ROUNDS);
};
/**
 * Compare a plain value with a hashed one.
 * @param plain - The plain text to compare.
 * @param hashed - The hashed value to compare against.
 * @returns True if both match, false otherwise.
 */
const compare = async (plain, hashed) => {
    return await bcrypt_1.default.compare(plain, hashed);
};
/**
 * Generates a secure token by hashing a UUID.
 * Can be used for password recovery, email verification, etc.
 * @returns A hashed UUID string.
 */
const generateToken = async () => {
    const raw = (0, crypto_1.randomUUID)(); // You can optionally prefix or timestamp this
    return await hash(raw);
};
exports.default = {
    hash,
    compare,
    generateToken,
};
