import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Footer.module.css';

const Footer = () => {
  const { setLoginModalOpen } = useAuth();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerCol}>
          <h3>Thành Thịnh Phát</h3>
          <p>
            Chuyên cung cấp và thi công các sản phẩm nhôm kính cao cấp.
            Với nhiều năm kinh nghiệm, chúng tôi cam kết mang đến sản phẩm
            chất lượng và dịch vụ tốt nhất cho khách hàng.
          </p>
        </div>

        <div className={styles.footerCol}>
          <h3>Liên Kết Nhanh</h3>
          <ul className={styles.footerLinks}>
            <li><Link to="/">Trang Chủ</Link></li>
            <li><Link to="/san-pham">Sản Phẩm</Link></li>
            <li><Link to="/gioi-thieu">Giới Thiệu</Link></li>
            <li><Link to="/lien-he">Liên Hệ</Link></li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h3>Danh Mục Sản Phẩm</h3>
          <ul className={styles.footerLinks}>
            <li><Link to="/san-pham?category=cua-nhom-kinh">Cửa Nhôm Kính</Link></li>
            <li><Link to="/san-pham?category=vach-kinh">Vách Kính</Link></li>
            <li><Link to="/san-pham?category=lan-can-kinh">Lan Can Kính</Link></li>
            <li><Link to="/san-pham?category=mai-kinh">Mái Kính</Link></li>
            <li><Link to="/san-pham?category=cua-cuon">Cửa Cuốn</Link></li>
            <li><Link to="/san-pham?category=phong-tam-kinh">Phòng Tắm Kính</Link></li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h3>Liên Hệ</h3>
          <div className={styles.contactItem}>
            <MapPin size={16} />
            <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
          </div>
          <div className={styles.contactItem}>
            <Phone size={16} />
            <span>0901.234.567</span>
          </div>
          <div className={styles.contactItem}>
            <Mail size={16} />
            <span>info@thanhthinhphat.vn</span>
          </div>
          <div className={styles.contactItem}>
            <Clock size={16} />
            <span>T2 - T7: 7:30 - 17:30</span>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p 
          onDoubleClick={() => setLoginModalOpen(true)} 
          style={{ cursor: 'default', userSelect: 'none' }}
          title="Nhấp đúp chuột để quản trị"
        >
          © 2024 Nhôm Kính Thành Thịnh Phát. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
