// src/config/db.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

class DB {
  // Singleton connection instance
  private static instance: mysql.Connection;

  // Returns the singleton connection or creates it if it doesn't exist
  static async getInstance(): Promise<mysql.Connection> {
    if (!DB.instance) {
      DB.instance = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });

      try {
        // Basic query to validate connection
        await DB.instance.query("SELECT 1");
        console.log("MySQL connection established.");
      } catch (err) {
        console.error("Error connecting to MySQL:", err);
        throw new Error("Error connecting to the database.");
      }
    }

    return DB.instance;
  }
}

export default DB;
