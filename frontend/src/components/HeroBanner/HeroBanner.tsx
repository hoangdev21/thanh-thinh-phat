import { Link } from 'react-router-dom';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  return (
    <section className={styles.hero}>
      {/* Subtle blueprint grid for architectural precision */}
      <div className={styles.architectGrid} />
      
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          THÀNH THỊNH PHÁT
          <strong>Nhôm Kính Chuyên Nghiệp</strong>
        </h1>
        <div className={styles.decorativeLine} />
        <p className={styles.heroSubtitle}>
          Thành Thịnh Phát chuyên cung cấp và thi công lắp đặt các giải pháp nhôm kính Xingfa, vách kính cường lực và cửa cuốn cao cấp. Đồng hành cùng kiến tạo những công trình Việt vững bền, đẳng cấp.
        </p>
        <div className={styles.heroBtns}>
          <Link to="/san-pham" className={`${styles.btn} ${styles.btnPrimary}`}>
            Xem Sản Phẩm
          </Link>
          <Link to="/lien-he" className={`${styles.btn} ${styles.btnOutline}`}>
            Liên Hệ Ngay
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
