import { Response } from 'express';
import { ApiResponse } from '../types';

export function successResponse<T>(
  res: Response,
  data: T,
  message?: string,
  pagination?: ApiResponse<T>['pagination'],
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    pagination,
  };
  res.status(statusCode).json(response);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 500
): void {
  const response: ApiResponse<null> = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
}
