import { Request, Response, NextFunction } from 'express';
import { ContactModel } from '../models/contact.model';
import { successResponse, errorResponse } from '../utils/response';

export const ContactController = {
  async createContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, phone, email, message, product_id } = req.body;

      // Validation
      if (!name || !name.trim()) {
        errorResponse(res, 'Vui lòng nhập họ tên', 400);
        return;
      }

      if (!phone || !phone.trim()) {
        errorResponse(res, 'Vui lòng nhập số điện thoại', 400);
        return;
      }

      // Basic phone validation (Vietnamese phone numbers)
      const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        errorResponse(res, 'Số điện thoại không hợp lệ', 400);
        return;
      }

      const insertId = await ContactModel.create({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || undefined,
        message: message?.trim() || '',
        product_id: product_id || undefined,
      });

      successResponse(
        res,
        { id: insertId },
        'Gửi yêu cầu liên hệ thành công. Chúng tôi sẽ liên lạc với bạn sớm nhất!',
        undefined,
        201
      );
    } catch (error) {
      next(error);
    }
  },

  async getAllContacts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contacts = await ContactModel.getAll();
      successResponse(res, contacts, 'Lấy danh sách liên hệ thành công');
    } catch (error) {
      next(error);
    }
  },
};
