import pool from '../config/database';
import { ContactRequest } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const ContactModel = {
  async create(data: ContactRequest): Promise<number> {
    const { name, phone, email, message, product_id } = data;
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO contact_requests (name, phone, email, message, product_id)
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone, email || null, message, product_id || null]
    );
    return result.insertId;
  },

  async getAll(): Promise<ContactRequest[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT cr.*, p.name as product_name
       FROM contact_requests cr
       LEFT JOIN products p ON cr.product_id = p.id
       ORDER BY cr.created_at DESC`
    );
    return rows as ContactRequest[];
  },
};
