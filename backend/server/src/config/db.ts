import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import Logger from './logger';
dotenv.config();

const state = {
    // @ts-ignore
    pool: null
};

const connect = async (): Promise<void> => {
    try {
        state.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });

        await state.pool.getConnection(); // Check connection
        Logger.info(`Successfully connected to the local MySQL database.`);
    } catch (error) {
        Logger.error(`Error connecting to the database: ${error.message}`);
        throw error;
    }
};

const getPool = (): mysql.Pool => {
    if (!state.pool) {
        throw new Error('Database connection has not been established.');
    }
    return state.pool;
};

export { connect, getPool };
