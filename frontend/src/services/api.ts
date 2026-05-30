import axios from 'axios';
import type {
  Category,
  Product,
  ContactFormData,
  ApiResponse,
  PaginationInfo,
  Admin,
  ContactRequest,
  AdminStats,
} from '../types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT Token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttp_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// Public Visitor APIs
// ==========================================

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<ApiResponse<Category[]>>('/categories');
  return response.data.data || [];
};

export const getProducts = async (params?: {
  category_id?: number;
  is_featured?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ data: Product[]; pagination?: PaginationInfo }> => {
  const response = await api.get<ApiResponse<Product[]>>('/products', { params });
  return {
    data: response.data.data || [],
    pagination: response.data.pagination,
  };
};

export const getProductBySlug = async (slug: string): Promise<{ product: Product; related: Product[] }> => {
  const response = await api.get<ApiResponse<{ product: Product; related: Product[] }>>(`/products/${slug}`);
  return response.data.data!;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await api.get<ApiResponse<Product[]>>('/products/featured');
  return response.data.data || [];
};

export const submitContact = async (data: ContactFormData): Promise<{ message: string }> => {
  const response = await api.post<ApiResponse<null>>('/contact', data);
  return { message: response.data.message || 'Gửi yêu cầu thành công!' };
};

// ==========================================
// Admin Authentication APIs
// ==========================================

export const loginAdmin = async (
  username: string,
  password: string
): Promise<{ token: string; admin: Admin }> => {
  const response = await api.post<ApiResponse<{ token: string; admin: Admin }>>('/auth/login', {
    username,
    password,
  });
  return response.data.data!;
};

export const getAdminMe = async (): Promise<Admin> => {
  const response = await api.get<ApiResponse<Admin>>('/auth/me');
  return response.data.data!;
};

// ==========================================
// Admin Statistics & Contacts APIs
// ==========================================

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get<ApiResponse<AdminStats>>('/admin/stats');
  return response.data.data!;
};

export const getAdminContacts = async (): Promise<ContactRequest[]> => {
  const response = await api.get<ApiResponse<ContactRequest[]>>('/admin/contacts');
  return response.data.data || [];
};

export const updateContactStatus = async (
  id: number,
  status: 'new' | 'contacted' | 'done'
): Promise<void> => {
  await api.put(`/admin/contacts/${id}`, { status });
};

// ==========================================
// Admin Product CRUD APIs (Multipart/FormData)
// ==========================================

export const createProduct = async (formData: FormData): Promise<{ id: number }> => {
  const response = await api.post<ApiResponse<{ id: number }>>('/admin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data!;
};

export const updateProduct = async (id: number, formData: FormData): Promise<void> => {
  await api.put(`/admin/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/admin/products/${id}`);
};

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post<ApiResponse<{ url: string }>>('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data!.url;
};
