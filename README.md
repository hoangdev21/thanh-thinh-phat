# Nhôm Kính Thành Thịnh Phát — Website Trình Bày Sản Phẩm Cao Cấp

Website giới thiệu, trưng bày sản phẩm nhôm kính cao cấp dành cho xưởng **Thành Thịnh Phát**. Website được thiết kế chuyên nghiệp, hiện đại, tối ưu trải nghiệm trên mọi thiết bị và tích hợp biểu mẫu liên hệ trực tiếp.

---

## 🎨 Bảng Màu & Thiết Kế (Từ Logo)

Nhằm đảm bảo tính đồng bộ nhận diện thương hiệu, website sử dụng các màu sắc chủ đạo từ logo:
- **Primary Navy (`#1B2A4A`)**: Dùng cho Header, Footer, và các phần chữ chính.
- **Secondary Red (`#C41E3A`)**: Dùng cho các nút kêu gọi hành động (CTA), liên kết nổi bật, và trạng thái hover.
- **Background (`#F5F6F8`)**: Nền sáng thanh lịch, hiện đại.
- **Không sử dụng gradient** nhằm tuân thủ thiết kế tối giản, tinh tế theo yêu cầu.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Real-time reload nhanh chóng)
- **React Router DOM v6** (Quản lý luồng trang)
- **Lucide React** (Bộ icon hiện đại)
- **Axios** (Kết nối API)
- **CSS Modules & Vanilla CSS** (Quản lý styles độc lập, gọn nhẹ)

### Backend
- **Node.js** + **Express** + **TypeScript**
- **MySQL** (Quản lý dữ liệu quan hệ)
- **Cloudinary** (Lưu trữ và quản lý hình ảnh sản phẩm)
- **Multer** (Xử lý tải lên tệp tin)

---

## 📂 Cấu Trúc Dự Án

Dự án được phân chia độc lập giữa `frontend` và `backend` giúp dễ quản lý và mở rộng trong tương lai:

```text
thanh-thinh-phat/
├── backend/
│   ├── database/        # Tệp MySQL Schema và dữ liệu mẫu
│   │   └── schema.sql
│   ├── src/
│   │   ├── config/      # Cấu hình Database & Cloudinary
│   │   ├── controllers/ # Bộ điều khiển nghiệp vụ (Category, Product, Contact)
│   │   ├── middleware/  # Bộ lọc lỗi toàn cục (Error Handler)
│   │   ├── models/      # Mô hình tương tác cơ sở dữ liệu MySQL
│   │   ├── routes/      # Định tuyến các cổng API
│   │   ├── types/       # Định nghĩa TypeScript dùng chung
│   │   └── utils/       # Tiện ích bổ trợ phản hồi API
│   ├── app.ts           # Entry point của Express server
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/      # Thiết kế CSS design tokens (variables, reset, global)
│   │   ├── components/  # 8 thành phần UI độc lập (Header, Footer, v.v.)
│   │   ├── hooks/       # Custom React Hooks (useApi)
│   │   ├── pages/       # 5 trang hiển thị (Home, Products, Detail, About, Contact)
│   │   ├── services/    # Kết nối API tập trung (Axios)
│   │   ├── types/       # Định nghĩa TypeScript frontend
│   │   ├── App.tsx      # Quản lý định tuyến và layout chính
│   │   └── main.tsx     # Điểm khởi chạy ứng dụng React
│   ├── index.html
│   └── vite.config.ts
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Chuẩn Bị Cơ Sở Dữ Liệu
1. Mở **MySQL Workbench** hoặc terminal MySQL.
2. Nhập và chạy toàn bộ nội dung trong tệp `backend/database/schema.sql` để khởi tạo cơ sở dữ liệu `thanh_thinh_phat` và nạp dữ liệu mẫu ban đầu (6 danh mục, 18 sản phẩm chi tiết).

### 2. Cấu Hình Biến Môi Trường (Environment Variables)
Tạo tệp `.env` tại thư mục `backend/` dựa trên mẫu `.env.example`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=thanh_thinh_phat
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Khởi Chạy Backend
Di chuyển vào thư mục `backend/`, cài đặt thư viện và chạy máy chủ ở chế độ phát triển:
```bash
cd backend
npm install
npm run dev
```
Express API sẽ chạy tại: `http://localhost:5000/api`

### 4. Khởi Chạy Frontend
Di chuyển vào thư mục `frontend/`, cài đặt các gói phụ thuộc và khởi động Vite dev server:
```bash
cd ../frontend
npm install
npm run dev
```
Trang web sẽ chạy tại: `http://localhost:5173` (Vite được cấu hình proxy tự động mọi yêu cầu `/api` sang backend cổng `5000` để tránh lỗi CORS).

---

## ✨ Các Tính Năng Đã Hoàn Thiện

1. **Trang Chủ (HomePage)**:
   - Banner chào mừng lớn (HeroBanner) cùng các hình trang trí phẳng chuyên nghiệp.
   - Trưng bày các sản phẩm nổi bật (Featured Products) được tự động lấy từ cơ sở dữ liệu.
   - Grid danh mục sản phẩm trực quan, liên kết trực tiếp tới bộ lọc.
   - Phần giới thiệu các ưu điểm của xưởng (Chất lượng, Bảo hành, Tiến độ).
   - Nút gọi nhanh điện thoại nổi bật (CTA).

2. **Trang Sản Phẩm (ProductsPage)**:
   - Thanh lọc ngang theo các danh mục sản phẩm thực tế (Cửa nhôm kính, Vách kính, Lan can kính, Mái kính, Cửa cuốn, Phòng tắm kính).
   - Trình bày dạng lưới (Grid) đẹp mắt.
   - Tự động phân trang khi số lượng sản phẩm lớn.
   - Hoàn toàn responsive trên di động (đáp ứng tối thiểu 2 sản phẩm trên hàng ngang và hỗ trợ cuộn trượt mượt mà).

3. **Trang Chi Tiết Sản Phẩm (ProductDetailPage)**:
   - Hiển thị hình ảnh sản phẩm lớn cùng thông tin chi tiết, khoảng giá (Price range), và mô tả.
   - Tự động tìm kiếm và trình bày các sản phẩm liên quan trong cùng danh mục ở phía dưới.
   - Cung cấp nút liên hệ nhanh giúp khách hàng dễ dàng đặt hàng qua SĐT.

4. **Trang Giới Thiệu (AboutPage)**:
   - Giới thiệu chặng đường 10 năm kinh nghiệm của xưởng.
   - Grid các con số ấn tượng (Dự án, Khách hàng, Kinh nghiệm).
   - Cam kết vàng từ thương hiệu Thành Thịnh Phát.

5. **Trang Liên Hệ (ContactPage)**:
   - Các thẻ thông tin liên hệ trực tiếp (Địa chỉ, SĐT, Email, Giờ làm việc).
   - Biểu mẫu liên hệ (ContactForm) xác thực dữ liệu đầy đủ bằng tiếng Việt (Họ tên, SĐT hợp lệ) và gửi yêu cầu trực tiếp vào database MySQL của backend.
   - Bản đồ Google Maps nhúng trực quan.
