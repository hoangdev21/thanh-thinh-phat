import pool from '../config/database';
import { Product } from '../types';
import { RowDataPacket } from 'mysql2';

interface ProductFilters {
  category_id?: number;
  is_featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const ProductModel = {
  async getAll(filters: ProductFilters = {}): Promise<{ products: Product[]; total: number }> {
    const { category_id, is_featured, search, page = 1, limit = 12 } = filters;

    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    let dataQuery = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params: (string | number | boolean)[] = [];
    const countParams: (string | number | boolean)[] = [];

    if (category_id) {
      countQuery += ' AND category_id = ?';
      dataQuery += ' AND p.category_id = ?';
      params.push(category_id);
      countParams.push(category_id);
    }

    if (is_featured !== undefined) {
      countQuery += ' AND is_featured = ?';
      dataQuery += ' AND p.is_featured = ?';
      params.push(is_featured);
      countParams.push(is_featured);
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      dataQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }

    dataQuery += ' ORDER BY p.created_at DESC';

    const offset = (page - 1) * limit;
    dataQuery += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    const total = (countRows[0] as { total: number }).total;

    const [rows] = await pool.query<RowDataPacket[]>(dataQuery, params);

    return { products: rows as Product[], total };
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ?`,
      [slug]
    );
    return (rows as Product[])[0] || null;
  },

  async getFeatured(): Promise<Product[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_featured = TRUE
       ORDER BY p.created_at DESC`
    );
    return rows as Product[];
  },

  async getByCategory(categoryId: number): Promise<Product[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ?
       ORDER BY p.created_at DESC`,
      [categoryId]
    );
    return rows as Product[];
  },

  async getRelated(categoryId: number, excludeId: number, limit: number = 4): Promise<Product[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.id != ?
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [categoryId, excludeId, limit]
    );
    return rows as Product[];
  },

  async create(product: Omit<Product, 'id' | 'created_at'>): Promise<number> {
    const slug = product.slug || slugify(product.name);
    let finalSlug = slug;
    let counter = 1;
    while (true) {
      const [existing] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM products WHERE slug = ?',
        [finalSlug]
      );
      if (existing.length === 0) break;
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const [result] = await pool.query(
      `INSERT INTO products (
        name, slug, description, price_range, category_id, image_url, thumbnail_url, is_featured,
        code, brand, color, material, option_name, thickness, hardware, warranty, soundproof, status,
        gallery_images, features, guides
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        finalSlug,
        product.description,
        product.price_range,
        product.category_id,
        product.image_url,
        product.thumbnail_url || product.image_url,
        product.is_featured ? 1 : 0,
        product.code || null,
        product.brand || null,
        product.color || null,
        product.material || null,
        product.option_name || null,
        product.thickness || null,
        product.hardware || null,
        product.warranty || null,
        product.soundproof || null,
        product.status || 'Còn hàng',
        product.gallery_images || null,
        product.features || null,
        product.guides || null
      ]
    );
    return (result as any).insertId;
  },

  async update(id: number, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];

    if (product.name !== undefined) {
      updates.push('name = ?');
      params.push(product.name);
      
      if (product.slug === undefined) {
        let slug = slugify(product.name);
        let finalSlug = slug;
        let counter = 1;
        while (true) {
          const [existing] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM products WHERE slug = ? AND id != ?',
            [finalSlug, id]
          );
          if (existing.length === 0) break;
          finalSlug = `${slug}-${counter}`;
          counter++;
        }
        updates.push('slug = ?');
        params.push(finalSlug);
      }
    }

    if (product.slug !== undefined) {
      updates.push('slug = ?');
      params.push(product.slug);
    }
    if (product.description !== undefined) {
      updates.push('description = ?');
      params.push(product.description);
    }
    if (product.price_range !== undefined) {
      updates.push('price_range = ?');
      params.push(product.price_range);
    }
    if (product.category_id !== undefined) {
      updates.push('category_id = ?');
      params.push(product.category_id);
    }
    if (product.image_url !== undefined) {
      updates.push('image_url = ?');
      params.push(product.image_url);
    }
    if (product.thumbnail_url !== undefined) {
      updates.push('thumbnail_url = ?');
      params.push(product.thumbnail_url);
    }
    if (product.is_featured !== undefined) {
      updates.push('is_featured = ?');
      params.push(product.is_featured ? 1 : 0);
    }
    if (product.code !== undefined) {
      updates.push('code = ?');
      params.push(product.code);
    }
    if (product.brand !== undefined) {
      updates.push('brand = ?');
      params.push(product.brand);
    }
    if (product.color !== undefined) {
      updates.push('color = ?');
      params.push(product.color);
    }
    if (product.material !== undefined) {
      updates.push('material = ?');
      params.push(product.material);
    }
    if (product.option_name !== undefined) {
      updates.push('option_name = ?');
      params.push(product.option_name);
    }
    if (product.thickness !== undefined) {
      updates.push('thickness = ?');
      params.push(product.thickness);
    }
    if (product.hardware !== undefined) {
      updates.push('hardware = ?');
      params.push(product.hardware);
    }
    if (product.warranty !== undefined) {
      updates.push('warranty = ?');
      params.push(product.warranty);
    }
    if (product.soundproof !== undefined) {
      updates.push('soundproof = ?');
      params.push(product.soundproof);
    }
    if (product.status !== undefined) {
      updates.push('status = ?');
      params.push(product.status);
    }
    if (product.gallery_images !== undefined) {
      updates.push('gallery_images = ?');
      params.push(product.gallery_images);
    }
    if (product.features !== undefined) {
      updates.push('features = ?');
      params.push(product.features);
    }
    if (product.guides !== undefined) {
      updates.push('guides = ?');
      params.push(product.guides);
    }

    if (updates.length === 0) return false;

    params.push(id);
    const [result] = await pool.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    return (result as any).affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
};

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

