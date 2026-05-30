import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  adminId?: number;
  adminUsername?: string;
}

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Quyền truy cập bị từ chối. Vui lòng đăng nhập lại.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'thanh_thinh_phat_secret_key';

    const decoded = jwt.verify(token, secret) as { id: number; username: string };

    req.adminId = decoded.id;
    req.adminUsername = decoded.username;

    next();
  } catch (error) {
    errorResponse(res, 'Phiên làm việc hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.', 401);
  }
};
