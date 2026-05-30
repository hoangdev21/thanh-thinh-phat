import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, ChevronRight, Check, X, ChevronLeft } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';
import { getProductBySlug } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import type { Product } from '../../types';
import styles from './ProductDetail.module.css';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useApi(
    () => getProductBySlug(slug || ''),
    [slug]
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prevProductId, setPrevProductId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'guides'>('features');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Synchronize keyboard shortcuts (Escape, ArrowLeft, ArrowRight) for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null || !data?.product) return;

      // Safely extract gallery inside the hook to avoid ordering dependencies
      let gallery: string[] = [];
      if (data.product.gallery_images) {
        try {
          gallery = JSON.parse(data.product.gallery_images);
        } catch (err) {}
      }
      if (!gallery || gallery.length === 0) {
        gallery = Array.from(
          new Set([data.product.image_url, data.product.thumbnail_url].filter(Boolean))
        ) as string[];
      }

      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : null));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : null));
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, data]);

  if (loading) return <Loading />;
  if (error || !data) {
    return (
      <main className={styles.detailPage}>
        <div className="page-header"><h1>Không tìm thấy sản phẩm</h1></div>
      </main>
    );
  }

  const { product, related } = data;

  // Sync selected image state during render when a different product is loaded
  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    setSelectedImage(null);
  }

  const activeImage = selectedImage || product.image_url;

  // Fully dynamic specs directly loaded from database properties
  const specs = {
    code: product.code || `TTP-SP-${product.id.toString().padStart(3, '0')}`,
    brand: product.brand || 'Thành Thịnh Phát',
    color: product.color || 'Tùy chọn theo thiết kế',
    material: product.material || 'Hợp kim nhôm & Kính cường lực',
    option: product.option_name || 'TIÊU CHUẨN',
    status: product.status || 'Còn hàng',
    thickness: product.thickness || 'Theo tiêu chuẩn kỹ thuật',
    hardware: product.hardware || 'Phụ kiện kim khí đồng bộ',
    soundproof: product.soundproof || 'Đạt tiêu chuẩn cách âm TCVN',
    warranty: product.warranty || '2 năm'
  };

  // Dynamic gallery from JSON or fallback
  let gallery: string[] = [];
  if (product.gallery_images) {
    try {
      gallery = JSON.parse(product.gallery_images);
    } catch (e) {
      console.error('Error parsing gallery_images JSON:', e);
    }
  }
  if (!gallery || gallery.length === 0) {
    gallery = Array.from(
      new Set([product.image_url, product.thumbnail_url].filter(Boolean))
    ) as string[];
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || lightboxIndex === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      setLightboxIndex((lightboxIndex + 1) % gallery.length);
    } else if (diff < -50) {
      setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
    }
    setTouchStart(null);
  };

  // Parse features and guides lists
  const featuresList = product.features
    ? product.features.split('\n').map(item => item.trim()).filter(Boolean)
    : [
        'Thiết kế hiện đại, tinh giản theo xu hướng kiến trúc mới nhất.',
        'Khung liên kết vững chắc, chịu áp lực gió lớn và chống ngập úng cực tốt.',
        'Keo silicone liên kết chống thấm nước tuyệt đối, bảo vệ tường nhà.',
        'Bề mặt sơn phủ tĩnh điện cao cấp, không phai màu hay trầy xước.'
      ];

  const guidesList = product.guides
    ? product.guides.split('\n').map(item => item.trim()).filter(Boolean)
    : [
        'Khảo sát và Đo đạc: Đội ngũ thợ kỹ thuật đến trực tiếp công trình khảo sát hiện trạng và đo đạc kích thước thực tế chuẩn xác từng milimet.',
        'Tư vấn và Chốt bản vẽ: Tư vấn phương án thiết kế tối ưu, chốt chủng loại vật liệu (nhôm, kính, phụ kiện) và báo giá minh bạch.',
        'Gia công tại Xưởng: Sản phẩm được gia công, cắt ghép trên dây chuyền máy móc hiện đại tại nhà xưởng Thành Thịnh Phát.',
        'Lắp đặt & Nghiệm thu: Vận chuyển an toàn, tiến hành căn chỉnh, lắp đặt chắc chắn tại công trình, bắn keo silicone liên kết chống thấm nước tuyệt đối.',
        'Bàn giao & Bảo hành: Vệ sinh sạch sẽ, vận hành thử êm ái, bàn giao phiếu bảo hành chính hãng từ 2 đến 5 năm cho khách hàng.'
      ];

  const renderGuideStep = (stepText: string) => {
    const colonIndex = stepText.indexOf(':');
    if (colonIndex !== -1) {
      const boldText = stepText.substring(0, colonIndex + 1);
      const regularText = stepText.substring(colonIndex + 1);
      return (
        <>
          <strong>{boldText}</strong>{regularText}
        </>
      );
    }
    return stepText;
  };

  return (
    <main className={styles.detailPage}>
      <div className={styles.detailContent}>
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/">Trang Chủ</Link>
          <ChevronRight size={14} />
          <Link to="/san-pham">Sản Phẩm</Link>
          <ChevronRight size={14} />
          {product.category_name && (
            <>
              <Link to={`/san-pham?category=${product.category_id}`}>{product.category_name}</Link>
              <ChevronRight size={14} />
            </>
          )}
          <span>{product.name}</span>
        </nav>

        {/* DESKTOP/TABLET VIEW (Approved pristine layout) */}
        <div className={styles.desktopView}>
          <div className={styles.detailGrid}>
            {/* LEFT COLUMN: Gallery & Tabs */}
            <div className={styles.leftColumn}>
              {/* Main Visual Box */}
              <div className={styles.imageSection} onClick={() => setLightboxIndex(gallery.indexOf(activeImage))}>
                <img src={activeImage || product.image_url} alt={product.name} className={styles.mainImage} />
              </div>

              {/* Thumbnail Gallery Row */}
              <div className={styles.galleryRow}>
                {gallery.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`${styles.thumbnailWrapper} ${activeImage === imgUrl ? styles.thumbnailActive : ''}`}
                    onClick={() => setSelectedImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`${product.name} detail view ${idx + 1}`} />
                  </div>
                ))}
              </div>

              {/* Architectural Tabbed Content */}
              <div className={styles.tabsSection}>
                <div className={styles.tabHeaders}>
                  <button
                    className={`${styles.tabBtn} ${activeTab === 'features' ? styles.tabBtnActive : ''}`}
                    onClick={() => setActiveTab('features')}
                  >
                    TÍNH NĂNG
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === 'specs' ? styles.tabBtnActive : ''}`}
                    onClick={() => setActiveTab('specs')}
                  >
                    THÔNG SỐ KỸ THUẬT
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === 'guides' ? styles.tabBtnActive : ''}`}
                    onClick={() => setActiveTab('guides')}
                  >
                    TÀI LIỆU HƯỚNG DẪN
                  </button>
                </div>

                <div className={styles.tabBody}>
                  {activeTab === 'features' && (
                    <div className={styles.tabContent}>
                      <p className={styles.description}>{product.description}</p>
                      <ul className={styles.featuresList}>
                        {featuresList.map((feat, idx) => (
                          <li key={idx}><Check size={16} /> {feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className={styles.tabContent}>
                      <table className={styles.specsTable}>
                        <tbody>
                          <tr>
                            <td>Mã sản phẩm</td>
                            <td>{specs.code}</td>
                          </tr>
                          <tr>
                            <td>Thương hiệu</td>
                            <td>{specs.brand}</td>
                          </tr>
                          <tr>
                            <td>Độ dày vật liệu</td>
                            <td>{specs.thickness}</td>
                          </tr>
                          <tr>
                            <td>Hệ phụ kiện</td>
                            <td>{specs.hardware}</td>
                          </tr>
                          <tr>
                            <td>Cách âm cách nhiệt</td>
                            <td>{specs.soundproof}</td>
                          </tr>
                          <tr>
                            <td>Bảo hành chính hãng</td>
                            <td>{specs.warranty}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'guides' && (
                    <div className={styles.tabContent}>
                      <h4 className={styles.guideTitle}>Quy Trình Thi Công Lắp Đặt Chuyên Nghiệp:</h4>
                      <ol className={styles.guideList}>
                        {guidesList.map((step, idx) => (
                          <li key={idx}>
                            {renderGuideStep(step)}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Information */}
            <div className={styles.infoSection}>
              {product.category_name && (
                <span className={styles.categoryBadge}>{product.category_name}</span>
              )}
              
              <h1 className={styles.productName}>{product.name}</h1>
              
              <p className={styles.priceTag}>{product.price_range}</p>

              {/* Details Specification Table */}
              <div className={styles.specGrid}>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Mã sản phẩm:</span>
                  <span className={styles.specValue}>{specs.code}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Thương hiệu:</span>
                  <span className={styles.specValueBrand}>{specs.brand}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Màu sắc:</span>
                  <span className={styles.specValue}>{specs.color}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Chất liệu:</span>
                  <span className={styles.specValue}>{specs.material}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Tùy chọn:</span>
                  <span className={styles.specValueOption}>{specs.option}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Trạng thái:</span>
                  <span className={styles.specValueStatus}>{specs.status}</span>
                </div>
              </div>

              {/* Direct Calls to Action */}
              <div className={styles.actions}>
                <Link to="/lien-he" className={styles.btnQuote}>
                  LIÊN HỆ BÁO GIÁ NGAY
                </Link>
                <a href="tel:0901234567" className={styles.btnPhone}>
                  <Phone size={18} /> GỌI HOTLINE: 0901.234.567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (Shopee Style: compact layout, small image left, specs right, actions & tabs below) */}
        <div className={styles.mobileView}>
          {/* Top Panel: Split grid */}
          <div className={styles.mobileTopGrid}>
            
            {/* Left Side: Smaller main image + compact thumbnails */}
            <div className={styles.mobileImgCol}>
              <div className={styles.mobileImageSection} onClick={() => setLightboxIndex(gallery.indexOf(activeImage))}>
                <img src={activeImage || product.image_url} alt={product.name} className={styles.mobileMainImage} />
              </div>
              
              <div className={styles.mobileGalleryRow}>
                {gallery.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`${styles.mobileThumbnailWrapper} ${activeImage === imgUrl ? styles.mobileThumbnailActive : ''}`}
                    onClick={() => setSelectedImage(imgUrl)}
                  >
                    <img src={imgUrl} alt="Thumb" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Category, Title, Price, and basic specs */}
            <div className={styles.mobileInfoCol}>
              {product.category_name && (
                <span className={styles.mobileCategoryBadge}>{product.category_name}</span>
              )}
              
              <h1 className={styles.mobileProductName}>{product.name}</h1>
              
              <p className={styles.mobilePriceTag}>{product.price_range}</p>

              {/* Compact specs summary */}
              <div className={styles.mobileSpecGrid}>
                <div className={styles.mobileSpecRow}>
                  <span className={styles.mobileSpecLabel}>Mã:</span>
                  <span className={styles.mobileSpecValue}>{specs.code}</span>
                </div>
                <div className={styles.mobileSpecRow}>
                  <span className={styles.mobileSpecLabel}>Hãng:</span>
                  <span className={styles.mobileSpecValueBrand}>{specs.brand}</span>
                </div>
                <div className={styles.mobileSpecRow}>
                  <span className={styles.mobileSpecLabel}>Màu:</span>
                  <span className={styles.mobileSpecValue}>{specs.color}</span>
                </div>
                <div className={styles.mobileSpecRow}>
                  <span className={styles.mobileSpecLabel}>Chất liệu:</span>
                  <span className={styles.mobileSpecValue}>{specs.material}</span>
                </div>
                <div className={styles.mobileSpecRow}>
                  <span className={styles.mobileSpecLabel}>Tùy chọn:</span>
                  <span className={styles.mobileSpecValueOption}>{specs.option}</span>
                </div>
                <div className={styles.mobileSpecRow}>
                  <span className={styles.mobileSpecLabel}>Trạng thái:</span>
                  <span className={styles.mobileSpecValueStatus}>{specs.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Call to Actions below top grid */}
          <div className={styles.mobileActions}>
            <Link to="/lien-he" className={styles.btnQuote}>
              LIÊN HỆ BÁO GIÁ NGAY
            </Link>
            <a href="tel:0901234567" className={styles.btnPhone}>
              <Phone size={16} /> GỌI HOTLINE: 0901.234.567
            </a>
          </div>

          {/* Full Width Tabs underneath */}
          <div className={styles.mobileTabsSection}>
            <div className={styles.tabHeaders}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'features' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('features')}
              >
                TÍNH NĂNG
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'specs' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                THÔNG SỐ
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'guides' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('guides')}
              >
                HƯỚNG DẪN
              </button>
            </div>

            <div className={styles.tabBody}>
              {activeTab === 'features' && (
                <div className={styles.tabContent}>
                  <p className={styles.description}>{product.description}</p>
                  <ul className={styles.featuresList}>
                    {featuresList.map((feat, idx) => (
                      <li key={idx}><Check size={16} /> {feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className={styles.tabContent}>
                  <table className={styles.specsTable}>
                    <tbody>
                      <tr>
                        <td>Mã sản phẩm</td>
                        <td>{specs.code}</td>
                      </tr>
                      <tr>
                        <td>Thương hiệu</td>
                        <td>{specs.brand}</td>
                      </tr>
                      <tr>
                        <td>Độ dày vật liệu</td>
                        <td>{specs.thickness}</td>
                      </tr>
                      <tr>
                        <td>Hệ phụ kiện</td>
                        <td>{specs.hardware}</td>
                      </tr>
                      <tr>
                        <td>Cách âm cách nhiệt</td>
                        <td>{specs.soundproof}</td>
                      </tr>
                      <tr>
                        <td>Bảo hành chính hãng</td>
                        <td>{specs.warranty}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'guides' && (
                <div className={styles.tabContent}>
                  <h4 className={styles.guideTitle}>Quy Trình Thi Công Lắp Đặt Chuyên Nghiệp:</h4>
                  <ol className={styles.guideList}>
                    {guidesList.map((step, idx) => (
                      <li key={idx}>
                        {renderGuideStep(step)}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Sản Phẩm Liên Quan</h2>
              <div className="section-divider" />
            </div>
            <div className="product-grid">
              {related.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Lightbox Modal (Full-screen Premium Gallery) */}
      {lightboxIndex !== null && (
        <div 
          className={styles.lightbox} 
          onClick={() => setLightboxIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button className={styles.lightboxClose} onClick={() => setLightboxIndex(null)} aria-label="Close lightbox">
            <X size={28} />
          </button>
          
          {/* Navigation Arrows */}
          <button 
            className={styles.lightboxArrowLeft} 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={36} />
          </button>
          
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img 
              src={gallery[lightboxIndex]} 
              alt={`${product.name} gallery view`} 
              className={styles.lightboxImage} 
            />
            {/* Image index counter */}
            <div className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {gallery.length}
            </div>
          </div>
          
          <button 
            className={styles.lightboxArrowRight} 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % gallery.length);
            }}
            aria-label="Next image"
          >
            <ChevronRight size={36} />
          </button>

          {/* Bottom Thumbnails */}
          <div className={styles.lightboxThumbs} onClick={(e) => e.stopPropagation()}>
            {gallery.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`${styles.lightboxThumbWrapper} ${lightboxIndex === idx ? styles.lightboxThumbActive : ''}`}
                onClick={() => setLightboxIndex(idx)}
              >
                <img src={imgUrl} alt="Thumb" />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetailPage;

