import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';
import { getFeaturedProducts } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import styles from './Home.module.css';

const HomePage = () => {
  const { data: featured, loading: featuredLoading } = useApi(() => getFeaturedProducts(), []);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionsRef.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <HeroBanner />

      {/* Sản Phẩm Nổi Bật */}
      <section className={styles.featuredSection}>
        <div ref={(el) => { sectionsRef.current[0] = el; }} className="fade-in">
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <div className="section-divider" />
            <p className="section-subtitle">Những sản phẩm chất lượng được khách hàng tin dùng</p>
          </div>
          {featuredLoading ? (
            <Loading />
          ) : (
            <div className="container">
              <div className="product-grid">
                {featured?.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {featured && featured.length > 8 && (
                <div className={styles.seeAllContainer}>
                  <Link to="/san-pham" className={styles.seeAllBtn}>
                    Xem tất cả
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Vì Sao Chọn Chúng Tôi */}
      <section className={styles.whySection}>
        <div ref={(el) => { sectionsRef.current[2] = el; }} className="container fade-in">
          <div className={styles.whyWrapper}>
            {/* Left Column: Editorial Introduction */}
            <div className={styles.whyLeft}>
              <span className={styles.whySubtitle}>Giá Trị Cốt Lõi</span>
              <h2 className={styles.whyMainTitle}>
                Vì Sao Chọn <br />
                <strong>Thành Thịnh Phát?</strong>
              </h2>
              <div className={styles.whyDecorativeLine} />
              <p className={styles.whyIntroText}>
                Chúng tôi không chỉ thi công nhôm kính, chúng tôi đồng hành kiến tạo những không gian sống an toàn, bền bỉ và đẳng cấp cho tổ ấm của bạn với cam kết chất lượng tuyệt đối.
              </p>
            </div>

            {/* Right Column: Sleek Typographic Cards */}
            <div className={styles.whyGrid}>
              <div className={styles.whyCard}>
                <span className={styles.whyCardNumber}>01</span>
                <div className={styles.whyCardContent}>
                  <h3 className={styles.whyCardTitle}>Chất Lượng Cao</h3>
                  <p className={styles.whyCardDesc}>Sử dụng vật liệu nhôm kính cao cấp, chính hãng từ các tập đoàn hàng đầu thế giới.</p>
                </div>
              </div>

              <div className={styles.whyCard}>
                <span className={styles.whyCardNumber}>02</span>
                <div className={styles.whyCardContent}>
                  <h3 className={styles.whyCardTitle}>Giao Hàng Nhanh</h3>
                  <p className={styles.whyCardDesc}>Cam kết thi công và bàn giao công trình chuẩn xác từng ngày theo đúng hợp đồng.</p>
                </div>
              </div>

              <div className={styles.whyCard}>
                <span className={styles.whyCardNumber}>03</span>
                <div className={styles.whyCardContent}>
                  <h3 className={styles.whyCardTitle}>Bảo Hành Dài Hạn</h3>
                  <p className={styles.whyCardDesc}>Chính sách bảo hành kết cấu lâu dài đến 5 năm, chế độ hậu mãi tận tâm chu đáo.</p>
                </div>
              </div>

              <div className={styles.whyCard}>
                <span className={styles.whyCardNumber}>04</span>
                <div className={styles.whyCardContent}>
                  <h3 className={styles.whyCardTitle}>Thi Công Chuyên Nghiệp</h3>
                  <p className={styles.whyCardDesc}>Đội ngũ kỹ thuật viên và thợ lắp đặt lành nghề, tận tụy kiến tạo độ bền vượt thời gian.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaWrapper}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Bạn Cần Tư Vấn Thiết Kế?</h2>
              <p className={styles.ctaText}>Liên hệ ngay để được tư vấn kỹ thuật miễn phí và nhận báo giá nhanh nhất.</p>
            </div>
            <div className={styles.ctaButtons}>
              <a href="tel:0901234567" className={`${styles.ctaBtn} ${styles.ctaBtnPrimary}`}>
                <Phone size={16} /> Gọi Ngay: 0901.234.567
              </a>
              <Link to="/lien-he" className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}>
                Gửi Yêu Cầu Báo Giá
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
