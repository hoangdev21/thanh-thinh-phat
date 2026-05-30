import { Request, Response, NextFunction } from 'express';
import { CategoryModel } from '../models/category.model';
import { successResponse, errorResponse } from '../utils/response';

export const CategoryController = {
  async getAllCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await CategoryModel.getAll();
      successResponse(res, categories, 'Lấy danh sách danh mục thành công');
    } catch (error) {
      next(error);
    }
  },

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await CategoryModel.getBySlug(slug);

      if (!category) {
        errorResponse(res, 'Không tìm thấy danh mục', 404);
        return;
      }

      successResponse(res, category, 'Lấy thông tin danh mục thành công');
    } catch (error) {
      next(error);
    }
  },
};
