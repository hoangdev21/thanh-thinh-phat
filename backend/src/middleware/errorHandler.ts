import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Đã xảy ra lỗi từ máy chủ';

  res.status(statusCode).json({
    success: false,
    message,
  });
}
