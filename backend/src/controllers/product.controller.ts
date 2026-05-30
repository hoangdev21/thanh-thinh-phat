import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '../models/product.model';
import { successResponse, errorResponse } from '../utils/response';

export const ProductController = {
  async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        category_id,
        is_featured,
        search,
        page = '1',
        limit = '12',
      } = req.query;

      const filters = {
        category_id: category_id ? parseInt(category_id as string, 10) : undefined,
        is_featured: is_featured !== undefined ? is_featured === 'true' : undefined,
        search: search as string | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      };

      const { products, total } = await ProductModel.getAll(filters);
      const totalPages = Math.ceil(total / filters.limit);

      successResponse(res, products, 'Lấy danh sách sản phẩm thành công', {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const product = await ProductModel.getBySlug(slug);

      if (!product) {
        errorResponse(res, 'Không tìm thấy sản phẩm', 404);
        return;
      }

      // Get related products
      const related = await ProductModel.getRelated(product.category_id, product.id);

      successResponse(res, { product, related }, 'Lấy thông tin sản phẩm thành công');
    } catch (error) {
      next(error);
    }
  },

  async getFeaturedProducts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await ProductModel.getFeatured();
      successResponse(res, products, 'Lấy sản phẩm nổi bật thành công');
    } catch (error) {
      next(error);
    }
  },
};
