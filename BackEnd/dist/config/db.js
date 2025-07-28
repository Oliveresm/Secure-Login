"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/db.ts
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
class DB {
    // Returns the singleton connection or creates it if it doesn't exist
    static async getInstance() {
        if (!DB.instance) {
            DB.instance = await promise_1.default.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
            });
            try {
                // Basic query to validate connection
                await DB.instance.query("SELECT 1");
                console.log("MySQL connection established.");
            }
            catch (err) {
                console.error("Error connecting to MySQL:", err);
                throw new Error("Error connecting to the database.");
            }
        }
        return DB.instance;
    }
}
exports.default = DB;
