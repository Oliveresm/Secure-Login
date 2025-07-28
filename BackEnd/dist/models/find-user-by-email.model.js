"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = findUserByEmail;
const db_1 = __importDefault(require("../config/db"));
async function findUserByEmail(email) {
    const db = await db_1.default.getInstance();
    const [rows] = await db.query('CALL get_user_by_email(?)', [email]);
    const userList = rows[0];
    const user = userList?.[0];
    return user || null;
}
