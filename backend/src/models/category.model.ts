import pool from '../config/database';
import { Category } from '../types';
import { RowDataPacket } from 'mysql2';

export const CategoryModel = {
  async getAll(): Promise<Category[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories ORDER BY id ASC'
    );
    return rows as Category[];
  },

  async getById(id: number): Promise<Category | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return (rows as Category[])[0] || null;
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE slug = ?',
      [slug]
    );
    return (rows as Category[])[0] || null;
  },
};
