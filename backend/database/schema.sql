-- =====================================================
-- Database Schema: Nhôm Kính Thành Phát
-- =====================================================

CREATE DATABASE IF NOT EXISTS thanh_thinh_phat
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE thanh_thinh_phat;

-- -----------------------------------------------------
-- Table: categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: products
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price_range VARCHAR(100),
  category_id INT NOT NULL,
  image_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  code VARCHAR(100),
  brand VARCHAR(100),
  color VARCHAR(255),
  material VARCHAR(255),
  option_name VARCHAR(100),
  thickness VARCHAR(255),
  hardware VARCHAR(255),
  warranty VARCHAR(100),
  soundproof VARCHAR(255),
  status VARCHAR(100) DEFAULT 'Còn hàng',
  gallery_images TEXT,
  features TEXT,
  guides TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: contact_requests
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  message TEXT,
  product_id INT,
  status ENUM('new', 'contacted', 'done') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: admins
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mật khẩu mặc định 'admin123' đã băm bằng bcrypt
INSERT INTO admins (username, password) VALUES
('admin', '$2b$10$wQA0Q86IMV9lzIjQPpsJMuokV0DMWVxknSt1fQL6vhiA0/RMOi66e')
ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- Seed Data: Categories
-- =====================================================
INSERT INTO categories (name, slug, description, image_url) VALUES
(
  'Cửa nhôm kính',
  'cua-nhom-kinh',
  'Các loại cửa nhôm kính cao cấp, cửa lùa, cửa mở quay, cửa sổ mở hất với khung nhôm Xingfa, Topal chính hãng. Bền đẹp, cách âm cách nhiệt tốt.',
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+Nhom+Kinh'
),
(
  'Vách kính',
  'vach-kinh',
  'Vách kính cường lực trang trí, vách ngăn phòng, vách kính mặt dựng cho văn phòng và nhà ở. Thiết kế hiện đại, tối ưu không gian.',
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Vach+Kinh'
),
(
  'Lan can kính',
  'lan-can-kinh',
  'Lan can kính cường lực cho ban công, cầu thang, sân thượng. An toàn tuyệt đối, tầm nhìn thoáng đãng, nâng tầm thẩm mỹ công trình.',
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Lan+Can+Kinh'
),
(
  'Mái kính',
  'mai-kinh',
  'Mái kính cường lực sân thượng, giếng trời, mái hiên. Lấy sáng tự nhiên, chống mưa gió, tạo không gian sống xanh.',
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Mai+Kinh'
),
(
  'Cửa cuốn',
  'cua-cuon',
  'Cửa cuốn nhôm, cửa cuốn tấm liền, cửa cuốn Đức cao cấp. Tiện lợi, bảo mật, vận hành êm ái bằng motor tự động.',
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+Cuon'
),
(
  'Phòng tắm kính',
  'phong-tam-kinh',
  'Vách tắm kính, cabin tắm kính cường lực thiết kế sang trọng. Chống nước tuyệt đối, dễ vệ sinh, phù hợp mọi không gian phòng tắm.',
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Phong+Tam+Kinh'
);

-- =====================================================
-- Seed Data: Products
-- =====================================================

-- Category 1: Cửa nhôm kính (id = 1)
INSERT INTO products (name, slug, description, price_range, category_id, image_url, thumbnail_url, is_featured) VALUES
(
  'Cửa lùa nhôm Xingfa 4 cánh',
  'cua-lua-nhom-xingfa-4-canh',
  'Cửa lùa nhôm Xingfa 4 cánh cao cấp, sử dụng thanh nhôm Xingfa chính hãng nhập khẩu Quảng Đông. Kính cường lực 8mm an toàn, hệ ray trượt êm ái, phù hợp cho phòng khách, ban công rộng. Bảo hành khung nhôm 10 năm.',
  '3.500.000 - 6.000.000 VNĐ/m²',
  1,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+Lua+Xingfa+4+Canh',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Cua+Lua+Xingfa+4+Canh',
  TRUE
),
(
  'Cửa đi nhôm kính cường lực',
  'cua-di-nhom-kinh-cuong-luc',
  'Cửa đi mở quay 1 cánh hoặc 2 cánh bằng nhôm kính cường lực. Khung nhôm dày dặn, bản lề chịu lực cao, kính cường lực 10mm chống va đập. Thích hợp cho cửa chính, cửa phòng ngủ, cửa ban công.',
  '2.800.000 - 4.500.000 VNĐ/m²',
  1,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+Di+Nhom+Kinh',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Cua+Di+Nhom+Kinh',
  FALSE
),
(
  'Cửa sổ mở hất nhôm Xingfa',
  'cua-so-mo-hat-nhom-xingfa',
  'Cửa sổ mở hất nhôm Xingfa hệ 55, mở góc 45 độ giúp đón gió tự nhiên mà vẫn chắn được mưa tạt. Kính hộp 2 lớp cách âm cách nhiệt hiệu quả. Phù hợp cho phòng ngủ, phòng làm việc.',
  '2.200.000 - 3.800.000 VNĐ/m²',
  1,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+So+Mo+Hat',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Cua+So+Mo+Hat',
  FALSE
);

-- Category 2: Vách kính (id = 2)
INSERT INTO products (name, slug, description, price_range, category_id, image_url, thumbnail_url, is_featured) VALUES
(
  'Vách kính cường lực 10mm',
  'vach-kinh-cuong-luc-10mm',
  'Vách kính cường lực 10mm trong suốt, chịu lực va đập gấp 5 lần kính thường. Phù hợp làm vách ngăn văn phòng, showroom, cửa hàng. Liên kết bằng phụ kiện inox 304 sáng bóng, bền bỉ theo thời gian.',
  '1.200.000 - 2.000.000 VNĐ/m²',
  2,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Vach+Kinh+10mm',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Vach+Kinh+10mm',
  TRUE
),
(
  'Vách ngăn phòng kính cường lực',
  'vach-ngan-phong-kinh-cuong-luc',
  'Vách ngăn phòng bằng kính cường lực kết hợp khung nhôm, tạo không gian riêng tư mà vẫn giữ được sự thoáng đãng. Có thể lắp thêm rèm cuốn hoặc film mờ tùy nhu cầu. Thi công nhanh, không ảnh hưởng kết cấu.',
  '1.500.000 - 2.500.000 VNĐ/m²',
  2,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Vach+Ngan+Phong',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Vach+Ngan+Phong',
  FALSE
),
(
  'Vách kính mặt dựng',
  'vach-kinh-mat-dung',
  'Hệ vách kính mặt dựng (curtain wall) dành cho tòa nhà văn phòng, trung tâm thương mại. Sử dụng kính hộp Low-E cách nhiệt, khung nhôm hệ lớn chịu gió bão. Tôn vẻ hiện đại và chuyên nghiệp cho công trình.',
  '2.500.000 - 4.000.000 VNĐ/m²',
  2,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Vach+Kinh+Mat+Dung',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Vach+Kinh+Mat+Dung',
  FALSE
);

-- Category 3: Lan can kính (id = 3)
INSERT INTO products (name, slug, description, price_range, category_id, image_url, thumbnail_url, is_featured) VALUES
(
  'Lan can kính cường lực ban công',
  'lan-can-kinh-cuong-luc-ban-cong',
  'Lan can kính cường lực 12mm cho ban công chung cư, nhà phố. Kẹp kính bằng inox 304 hoặc nhôm đúc chắc chắn. Tầm nhìn panorama thoáng đãng, không che chắn view, đạt tiêu chuẩn an toàn xây dựng.',
  '1.800.000 - 3.200.000 VNĐ/m²',
  3,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Lan+Can+Ban+Cong',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Lan+Can+Ban+Cong',
  TRUE
),
(
  'Lan can cầu thang kính',
  'lan-can-cau-thang-kinh',
  'Lan can cầu thang kính cường lực tạo cảm giác rộng rãi cho không gian. Kính dày 10-12mm kết hợp tay vịn inox hoặc gỗ tự nhiên. Phù hợp cho biệt thự, nhà phố hiện đại, khách sạn, resort.',
  '1.500.000 - 2.800.000 VNĐ/m²',
  3,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Lan+Can+Cau+Thang',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Lan+Can+Cau+Thang',
  FALSE
),
(
  'Lan can kính trụ inox',
  'lan-can-kinh-tru-inox',
  'Lan can kính cường lực với trụ inox 304 tròn hoặc vuông, thiết kế thanh mảnh tinh tế. Dễ dàng lắp đặt trên nhiều loại địa hình, phù hợp cho sân thượng, hành lang, ban công nhà ở và công trình công cộng.',
  '1.200.000 - 2.200.000 VNĐ/m²',
  3,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Lan+Can+Tru+Inox',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Lan+Can+Tru+Inox',
  FALSE
);

-- Category 4: Mái kính (id = 4)
INSERT INTO products (name, slug, description, price_range, category_id, image_url, thumbnail_url, is_featured) VALUES
(
  'Mái kính cường lực sân thượng',
  'mai-kinh-cuong-luc-san-thuong',
  'Mái kính cường lực dán an toàn (laminated) cho sân thượng, tạo không gian thư giãn tuyệt vời. Khung thép sơn tĩnh điện hoặc khung nhôm chịu lực, chống rỉ sét. Kính có thể chọn trong suốt hoặc phản quang chống nóng.',
  '2.000.000 - 3.500.000 VNĐ/m²',
  4,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Mai+Kinh+San+Thuong',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Mai+Kinh+San+Thuong',
  TRUE
),
(
  'Giếng trời kính cường lực',
  'gieng-troi-kinh-cuong-luc',
  'Giếng trời (skylight) kính cường lực dán an toàn, đưa ánh sáng tự nhiên vào không gian sống. Hệ khung nhôm kín nước, gioăng cao su EPDM chống thấm tuyệt đối. Giải pháp hoàn hảo cho nhà phố hẹp, tầng hầm.',
  '2.500.000 - 4.500.000 VNĐ/m²',
  4,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Gieng+Troi+Kinh',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Gieng+Troi+Kinh',
  FALSE
),
(
  'Mái hiên kính cường lực',
  'mai-hien-kinh-cuong-luc',
  'Mái hiên kính cường lực che mưa nắng cho lối vào, sân trước, ban công. Thiết kế tối giản với bát spider inox, kính cường lực 12mm trong suốt. Tôn vẻ sang trọng, hiện đại cho mặt tiền ngôi nhà.',
  '1.800.000 - 3.000.000 VNĐ/m²',
  4,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Mai+Hien+Kinh',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Mai+Hien+Kinh',
  FALSE
);

-- Category 5: Cửa cuốn (id = 5)
INSERT INTO products (name, slug, description, price_range, category_id, image_url, thumbnail_url, is_featured) VALUES
(
  'Cửa cuốn nhôm khe thoáng',
  'cua-cuon-nhom-khe-thoang',
  'Cửa cuốn nhôm khe thoáng cao cấp, nan nhôm dày 0.7-1.0mm, có khe thoáng gió khi đóng cửa. Motor Đài Loan êm ái, điều khiển remote từ xa tiện lợi. Phù hợp cho nhà phố, cửa hàng, garage ô tô.',
  '1.500.000 - 2.800.000 VNĐ/m²',
  5,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+Cuon+Khe+Thoang',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Cua+Cuon+Khe+Thoang',
  TRUE
),
(
  'Cửa cuốn tấm liền',
  'cua-cuon-tam-lien',
  'Cửa cuốn tấm liền (solid) bằng thép mạ kẽm hoặc nhôm, bề mặt phẳng kín. Cách âm, cách nhiệt, chống trộm hiệu quả. Sơn tĩnh điện nhiều màu sắc, motor tự động với hệ thống dừng khẩn cấp an toàn.',
  '1.200.000 - 2.200.000 VNĐ/m²',
  5,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+Cuon+Tam+Lien',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Cua+Cuon+Tam+Lien',
  FALSE
),
(
  'Cửa cuốn Đức Austdoor',
  'cua-cuon-duc-austdoor',
  'Cửa cuốn Austdoor thương hiệu Đức sản xuất tại Việt Nam. Nan nhôm 2 lớp cách âm cách nhiệt, motor Hitachi bền bỉ, hệ thống khóa từ chống cạy. Bảo hành motor 5 năm, nan nhôm 10 năm. Đẳng cấp và an tâm.',
  '2.500.000 - 4.000.000 VNĐ/m²',
  5,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cua+Cuon+Austdoor',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Cua+Cuon+Austdoor',
  FALSE
);

-- Category 6: Phòng tắm kính (id = 6)
INSERT INTO products (name, slug, description, price_range, category_id, image_url, thumbnail_url, is_featured) VALUES
(
  'Vách tắm kính 90 độ',
  'vach-tam-kinh-90-do',
  'Vách tắm kính cường lực 10mm góc 90 độ, thiết kế tối giản sang trọng. Phụ kiện bản lề, kẹp kính inox 304 cao cấp, gioăng silicone chống nước. Phù hợp phòng tắm diện tích nhỏ đến trung bình.',
  '2.500.000 - 4.000.000 VNĐ/bộ',
  6,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Vach+Tam+90+Do',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Vach+Tam+90+Do',
  TRUE
),
(
  'Cabin tắm kính cường lực',
  'cabin-tam-kinh-cuong-luc',
  'Cabin tắm kính cường lực đúc khuôn, gồm khay tắm, vách kính và phụ kiện hoàn chỉnh. Kính cường lực 8-10mm, khung nhôm mạ chrome sáng bóng. Lắp đặt nhanh gọn, đa dạng kích thước 80x80, 90x90, 100x100 cm.',
  '4.500.000 - 8.000.000 VNĐ/bộ',
  6,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Cabin+Tam+Kinh',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Cabin+Tam+Kinh',
  FALSE
),
(
  'Vách tắm kính cửa lùa',
  'vach-tam-kinh-cua-lua',
  'Vách tắm kính cường lực cửa lùa trượt êm ái trên ray inox, tiết kiệm không gian mở cửa. Kính dày 8-10mm, bề mặt phủ nano chống bám nước, dễ lau chùi. Phù hợp phòng tắm dài, bồn tắm nằm.',
  '3.000.000 - 5.500.000 VNĐ/bộ',
  6,
  'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Vach+Tam+Cua+Lua',
  'https://placehold.co/400x300/1B2A4A/FFFFFF?text=Vach+Tam+Cua+Lua',
  FALSE
);
