import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      console.log('Incoming login request:', { username, passwordLength: password?.length });

      if (!username || !password) {
        errorResponse(res, 'Vui lòng cung cấp đầy đủ tài khoản và mật khẩu', 400);
        return;
      }

      // Find admin
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM admins WHERE username = ?',
        [username]
      );

      const admin = rows[0];
      console.log('Admin query result from DB:', admin ? { id: admin.id, username: admin.username, dbPasswordHash: admin.password } : 'Not Found');

      if (!admin) {
        errorResponse(res, 'Tài khoản hoặc mật khẩu không chính xác', 401);
        return;
      }

      // Verify password
      const isMatch = bcrypt.compareSync(password, admin.password);
      console.log('Bcrypt comparison result:', isMatch);

      if (!isMatch) {
        errorResponse(res, 'Tài khoản hoặc mật khẩu không chính xác', 401);
        return;
      }

      // Generate JWT Token
      const secret = process.env.JWT_SECRET || 'thanh_thinh_phat_secret_key';
      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        secret,
        { expiresIn: '1d' } // Token lasts 1 day
      );

      successResponse(
        res,
        {
          token,
          admin: {
            id: admin.id,
            username: admin.username,
          },
        },
        'Đăng nhập thành công'
      );
    } catch (error) {
      next(error);
    }
  },

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.adminId) {
        errorResponse(res, 'Không có phiên làm việc hợp lệ', 401);
        return;
      }

      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id, username, created_at FROM admins WHERE id = ?',
        [req.adminId]
      );

      const admin = rows[0];

      if (!admin) {
        errorResponse(res, 'Không tìm thấy thông tin tài khoản', 404);
        return;
      }

      successResponse(res, admin, 'Xác nhận phiên đăng nhập thành công');
    } catch (error) {
      next(error);
    }
  },
};
