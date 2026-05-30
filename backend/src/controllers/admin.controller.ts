import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';
import { ProductModel } from '../models/product.model';
import { successResponse, errorResponse } from '../utils/response';
import cloudinary from '../config/cloudinary';

// Helper to upload memory buffer to Cloudinary
const uploadToCloudinary = (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'thanh-thinh-phat' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const AdminController = {
  // 1. Dashboard Overview Stats
  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get counts
      const [prodCount] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM products');
      const [catCount] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM categories');
      const [contactCount] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM contact_requests');
      const [newContactCount] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM contact_requests WHERE status = 'new'");

      // Get 5 recent contact requests
      const [recentContacts] = await pool.query<RowDataPacket[]>(
        `SELECT c.*, p.name as product_name
         FROM contact_requests c
         LEFT JOIN products p ON c.product_id = p.id
         ORDER BY c.created_at DESC
         LIMIT 5`
      );

      successResponse(
        res,
        {
          totalProducts: prodCount[0].count,
          totalCategories: catCount[0].count,
          totalContacts: contactCount[0].count,
          newContacts: newContactCount[0].count,
          recentContacts,
        },
        'Lấy thống kê admin thành công'
      );
    } catch (error) {
      next(error);
    }
  },

  // 2. Get all contact requests
  async getContacts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [contacts] = await pool.query<RowDataPacket[]>(
        `SELECT c.*, p.name as product_name
         FROM contact_requests c
         LEFT JOIN products p ON c.product_id = p.id
         ORDER BY c.created_at DESC`
      );

      successResponse(res, contacts, 'Lấy danh sách liên hệ thành công');
    } catch (error) {
      next(error);
    }
  },

  // 3. Update contact request status
  async updateContactStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['new', 'contacted', 'done'].includes(status)) {
        errorResponse(res, 'Trạng thái không hợp lệ', 400);
        return;
      }

      const [result] = await pool.query(
        'UPDATE contact_requests SET status = ? WHERE id = ?',
        [status, id]
      );

      if ((result as any).affectedRows === 0) {
        errorResponse(res, 'Không tìm thấy yêu cầu liên hệ', 404);
        return;
      }

      successResponse(res, null, 'Cập nhật trạng thái liên hệ thành công');
    } catch (error) {
      next(error);
    }
  },

  // 4. Create new product (Admin CRUD)
  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        name, description, price_range, category_id, is_featured, image_url,
        code, brand, color, material, option_name, thickness, hardware, warranty, soundproof, status,
        gallery_images, features, guides
      } = req.body;

      if (!name || !category_id) {
        errorResponse(res, 'Vui lòng cung cấp tên sản phẩm và danh mục', 400);
        return;
      }

      let finalImageUrl = image_url || 'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Thanh+Thinh+Phat';

      // If a file is uploaded, upload to Cloudinary
      if (req.file) {
        try {
          finalImageUrl = await uploadToCloudinary(req.file.buffer);
        } catch (uploadError) {
          console.error('Lỗi tải ảnh lên Cloudinary:', uploadError);
          errorResponse(res, 'Lỗi không thể tải ảnh lên Cloudinary', 500);
          return;
        }
      }

      const newProductId = await ProductModel.create({
        name,
        slug: '', // generated automatically
        description: description || '',
        price_range: price_range || 'Liên hệ để báo giá',
        category_id: parseInt(category_id, 10),
        image_url: finalImageUrl,
        thumbnail_url: finalImageUrl,
        is_featured: is_featured === 'true' || is_featured === true,
        code: code || '',
        brand: brand || '',
        color: color || '',
        material: material || '',
        option_name: option_name || 'TIÊU CHUẨN',
        thickness: thickness || '',
        hardware: hardware || '',
        warranty: warranty || '2 năm',
        soundproof: soundproof || '',
        status: status || 'Còn hàng',
        gallery_images: gallery_images || '',
        features: features || '',
        guides: guides || '',
      });

      const newProduct = await ProductModel.getBySlug(
        // we can query the new product directly by id, but currently our model has getBySlug. Let's return the ID.
        name
      );

      successResponse(res, { id: newProductId }, 'Thêm sản phẩm thành công', undefined);
    } catch (error) {
      next(error);
    }
  },

  // 5. Update product (Admin CRUD)
  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name, description, price_range, category_id, is_featured, image_url,
        code, brand, color, material, option_name, thickness, hardware, warranty, soundproof, status,
        gallery_images, features, guides
      } = req.body;

      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        errorResponse(res, 'ID sản phẩm không hợp lệ', 400);
        return;
      }

      // Check if product exists
      const [existingRows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM products WHERE id = ?',
        [productId]
      );
      if (existingRows.length === 0) {
        errorResponse(res, 'Không tìm thấy sản phẩm cần sửa', 404);
        return;
      }

      const updates: any = {};
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (price_range !== undefined) updates.price_range = price_range;
      if (category_id !== undefined) updates.category_id = parseInt(category_id, 10);
      if (is_featured !== undefined) updates.is_featured = is_featured === 'true' || is_featured === true;
      if (image_url !== undefined) {
        updates.image_url = image_url;
        updates.thumbnail_url = image_url;
      }
      if (code !== undefined) updates.code = code;
      if (brand !== undefined) updates.brand = brand;
      if (color !== undefined) updates.color = color;
      if (material !== undefined) updates.material = material;
      if (option_name !== undefined) updates.option_name = option_name;
      if (thickness !== undefined) updates.thickness = thickness;
      if (hardware !== undefined) updates.hardware = hardware;
      if (warranty !== undefined) updates.warranty = warranty;
      if (soundproof !== undefined) updates.soundproof = soundproof;
      if (status !== undefined) updates.status = status;
      if (gallery_images !== undefined) updates.gallery_images = gallery_images;
      if (features !== undefined) updates.features = features;
      if (guides !== undefined) updates.guides = guides;

      // If a file is uploaded, upload to Cloudinary and overwrite image_url
      if (req.file) {
        try {
          const cloudinaryUrl = await uploadToCloudinary(req.file.buffer);
          updates.image_url = cloudinaryUrl;
          updates.thumbnail_url = cloudinaryUrl;
        } catch (uploadError) {
          console.error('Lỗi tải ảnh lên Cloudinary:', uploadError);
          errorResponse(res, 'Lỗi không thể tải ảnh lên Cloudinary', 500);
          return;
        }
      }

      const updated = await ProductModel.update(productId, updates);

      if (!updated && Object.keys(updates).length > 0) {
        errorResponse(res, 'Không thể cập nhật sản phẩm', 500);
        return;
      }

      successResponse(res, null, 'Cập nhật sản phẩm thành công');
    } catch (error) {
      next(error);
    }
  },

  // 6. Delete product (Admin CRUD)
  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
        errorResponse(res, 'ID sản phẩm không hợp lệ', 400);
        return;
      }

      const deleted = await ProductModel.delete(productId);

      if (!deleted) {
        errorResponse(res, 'Không tìm thấy sản phẩm để xóa', 404);
        return;
      }

      successResponse(res, null, 'Xóa sản phẩm thành công');
    } catch (error) {
      next(error);
    }
  },

  // 7. Instant upload file to Cloudinary
  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        errorResponse(res, 'Không tìm thấy file tải lên', 400);
        return;
      }
      const url = await uploadToCloudinary(req.file.buffer);
      successResponse(res, { url }, 'Tải ảnh lên thành công');
    } catch (error) {
      next(error);
    }
  },
};
