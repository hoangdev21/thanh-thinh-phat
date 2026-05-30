import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const sslEnabled = (process.env.DB_SSL || '').toLowerCase() === 'true';
const sslCa = process.env.DB_SSL_CA;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'thanh_thinh_phat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  ...(sslEnabled
    ? {
        ssl: sslCa ? { rejectUnauthorized: true, ca: sslCa } : { rejectUnauthorized: true },
      }
    : {}),
});

export default pool;
