export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_range: string;
  category_id: number;
  category_name?: string;
  image_url: string;
  thumbnail_url: string;
  is_featured: boolean;
  created_at: string;
  code?: string;
  brand?: string;
  color?: string;
  material?: string;
  option_name?: string;
  thickness?: string;
  hardware?: string;
  warranty?: string;
  soundproof?: string;
  status?: string;
  gallery_images?: string;
  features?: string;
  guides?: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  message: string;
  product_id?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Admin {
  id: number;
  username: string;
}

export interface ContactRequest {
  id: number;
  name: string;
  phone: string;
  email?: string;
  message: string;
  product_id?: number;
  product_name?: string;
  status: 'new' | 'contacted' | 'done';
  created_at: string;
}

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  totalContacts: number;
  newContacts: number;
  recentContacts: ContactRequest[];
}
