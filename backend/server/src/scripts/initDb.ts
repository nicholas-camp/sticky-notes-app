// scripts/initDb.ts
import { createPool } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Logger from '../config/logger';

dotenv.config();

const waitForDb = async (pool: ReturnType<typeof createPool>, retries = 10, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.getConnection();
      return;
    } catch (err) {
      Logger.info(`Waiting for DB to be ready... retry ${i + 1}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Unable to connect to the database after multiple retries.');
};

const runInit = async () => {
  // Connect without specifying database first
  const pool = createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.MYSQL_PORT) || 3306,
    multipleStatements: true,
  });

  try {
    await waitForDb(pool);

    // Create database if it doesn't exist
    const dbName = process.env.MYSQL_DATABASE!;
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await pool.query(`USE \`${dbName}\`;`);

    // Read SQL file
    const sqlFilePath = path.join(__dirname, '../../../db/init.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

    // Split statements and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {
      await pool.query(stmt);
    }

    Logger.info('Database initialized successfully!');
    process.exit(0);
  } catch (error: any) {
    Logger.error(`Database initialization failed: ${error.message}`);
    process.exit(1);
  }
};

runInit();
