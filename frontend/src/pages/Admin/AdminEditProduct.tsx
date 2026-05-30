import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import Loading from '../../components/Loading/Loading';
import { getCategories, getProducts, updateProduct, uploadFile } from '../../services/api';
import type { Category } from '../../types';
import styles from './AdminForm.module.css';

const AdminEditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  // Load states
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Gallery multi-images
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [inputUrl, setInputUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Dynamic Features & Guides
  const [features, setFeatures] = useState('');
  const [guides, setGuides] = useState('');

  // Specifications fields
  const [code, setCode] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [optionName, setOptionName] = useState('TIÊU CHUẨN');
  const [thickness, setThickness] = useState('');
  const [hardware, setHardware] = useState('');
  const [warranty, setWarranty] = useState('2 năm');
  const [soundproof, setSoundproof] = useState('');
  const [status, setStatus] = useState('Còn hàng');

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !id) return;

    const loadData = async () => {
      setCategoriesLoading(true);
      setProductLoading(true);
      try {
        const [catData, prodData] = await Promise.all([
          getCategories(),
          getProducts({ limit: 100 }) // Load all to find matching ID
        ]);

        setCategories(catData);
        
        const productId = parseInt(id, 10);
        const product = prodData.data.find(p => p.id === productId);

        if (product) {
          setName(product.name);
          setCategoryId(product.category_id.toString());
          setPriceRange(product.price_range);
          setDescription(product.description);
          setIsFeatured(product.is_featured);
          
          // Parse gallery images
          let parsedGallery: string[] = [];
          if (product.gallery_images) {
            try {
              parsedGallery = JSON.parse(product.gallery_images);
            } catch (e) {
              console.error('Error parsing gallery_images:', e);
            }
          }
          if (!parsedGallery || parsedGallery.length === 0) {
            parsedGallery = [product.image_url].filter(Boolean);
          }
          setGalleryImages(parsedGallery);

          // Populate dynamic lists
          setFeatures(product.features || '');
          setGuides(product.guides || '');
          
          setCode(product.code || '');
          setBrand(product.brand || '');
          setColor(product.color || '');
          setMaterial(product.material || '');
          setOptionName(product.option_name || 'TIÊU CHUẨN');
          setThickness(product.thickness || '');
          setHardware(product.hardware || '');
          setWarranty(product.warranty || '2 năm');
          setSoundproof(product.soundproof || '');
          setStatus(product.status || 'Còn hàng');
        } else {
          setFormError('Không tìm thấy sản phẩm cần cập nhật.');
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin sản phẩm:', err);
        setFormError('Lỗi kết nối khi tải dữ liệu sản phẩm.');
      } finally {
        setCategoriesLoading(false);
        setProductLoading(false);
      }
    };

    loadData();
  }, [id, isAuthenticated]);

  // Drag and drop ordering logic
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...galleryImages];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setGalleryImages(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleAddImageUrl = () => {
    if (inputUrl.trim()) {
      setGalleryImages([...galleryImages, inputUrl.trim()]);
      setInputUrl('');
    }
  };

  const handleMultiFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const fileList = Array.from(e.target.files);
      const newUrls: string[] = [];
      for (const f of fileList) {
        try {
          const url = await uploadFile(f);
          newUrls.push(url);
        } catch (err) {
          console.error('Lỗi khi tải tệp lên Cloudinary:', err);
        }
      }
      if (newUrls.length > 0) {
        setGalleryImages([...galleryImages, ...newUrls]);
      }
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Vui lòng điền tên sản phẩm');
      return;
    }
    if (!categoryId) {
      setFormError('Vui lòng chọn danh mục sản phẩm');
      return;
    }
    if (!id) return;

    setFormLoading(true);

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('category_id', categoryId);
    formData.append('price_range', priceRange.trim());
    formData.append('description', description.trim());
    formData.append('is_featured', isFeatured ? 'true' : 'false');

    // Use first gallery image as primary
    const primaryImage = galleryImages[0] || 'https://placehold.co/800x600/1B2A4A/FFFFFF?text=Thanh+Thinh+Phat';
    formData.append('image_url', primaryImage);
    formData.append('thumbnail_url', primaryImage);
    formData.append('gallery_images', JSON.stringify(galleryImages));
    formData.append('features', features.trim());
    formData.append('guides', guides.trim());

    // Append specifications
    formData.append('code', code.trim());
    formData.append('brand', brand.trim());
    formData.append('color', color.trim());
    formData.append('material', material.trim());
    formData.append('option_name', optionName.trim());
    formData.append('thickness', thickness.trim());
    formData.append('hardware', hardware.trim());
    formData.append('warranty', warranty.trim());
    formData.append('soundproof', soundproof.trim());
    formData.append('status', status.trim());

    try {
      await updateProduct(parseInt(id, 10), formData);
      navigate('/admin/dashboard?tab=products');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setFormLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Quyền truy cập bị từ chối</h2>
        <p>Vui lòng đăng nhập quản trị viên để sử dụng chức năng này.</p>
      </div>
    );
  }

  if (categoriesLoading || productLoading) return <Loading />;

  return (
    <AdminLayout activeTab="products" onTabChange={() => navigate('/admin/dashboard')}>
      <div className={styles.pageContainer}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Cập Nhật Sản Phẩm</h3>
            <button
              onClick={() => navigate('/admin/dashboard?tab=products')}
              className="btn btn-outline-dark btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '0' }}
            >
              <ArrowLeft size={14} /> Quay Lại
            </button>
          </div>

          {formError && <div className={styles.errorMsg}>{formError}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <label className="form-label">Tên sản phẩm *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Cửa sổ mở hất nhôm Xingfa"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Danh mục sản phẩm *</label>
                <select
                  className="form-input"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Khoảng giá hiển thị</label>
                <input
                  type="text"
                  className="form-input"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="VD: 2.200.000 - 3.500.000 VNĐ/m²"
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className="form-label" style={{ fontWeight: 700 }}>Danh sách ảnh sản phẩm (Kéo thả để sắp xếp thứ tự hiển thị, ảnh đầu tiên làm ảnh chính)</label>
                <div className={styles.gallerySection}>
                  <div className={styles.galleryGrid}>
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`${styles.galleryItem} ${idx === 0 ? styles.galleryItemActive : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                      >
                        <img src={imgUrl} alt={`Gallery item ${idx + 1}`} className={styles.galleryItemImg} />
                        <button
                          type="button"
                          className={styles.galleryItemDelete}
                          onClick={() => handleRemoveGalleryImage(idx)}
                          title="Xóa ảnh"
                        >
                          ×
                        </button>
                        {idx === 0 && <div className={styles.galleryPrimaryBadge}>Ảnh chính</div>}
                      </div>
                    ))}
                    {galleryImages.length === 0 && (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        Chưa có ảnh nào. Vui lòng tải lên từ máy tính hoặc dán đường dẫn ảnh dưới đây.
                      </div>
                    )}
                  </div>

                  <div className={styles.galleryControls}>
                    <label className={styles.fileInputCompactLabel}>
                      <Upload size={14} />
                      Tải ảnh lên từ máy tính...
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultiFileChange}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {uploading && (
                      <span className={styles.uploadLoading}>
                        Đang tải ảnh lên...
                      </span>
                    )}

                    <div className={styles.galleryUrlInputGroup}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Hoặc dán URL hình ảnh..."
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        style={{ margin: 0 }}
                      />
                      <button
                        type="button"
                        className={styles.btnGalleryAdd}
                        onClick={handleAddImageUrl}
                      >
                        Thêm URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formGroupFull}>
                <label className="form-label">Mô tả sản phẩm</label>
                <textarea
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập thông tin chi tiết, xuất xứ vật liệu nhôm kính, bảo hành..."
                  rows={4}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className="form-label" style={{ fontWeight: 700 }}>Tính năng nổi bật (Mỗi dòng là một tính năng, hiển thị dạng dấu tích xanh)</label>
                <textarea
                  className="form-textarea"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="VD:&#10;Thiết kế hiện đại, tinh giản theo xu hướng kiến trúc mới nhất.&#10;Khung liên kết vững chắc, chịu áp lực gió lớn..."
                  rows={4}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className="form-label" style={{ fontWeight: 700 }}>Quy trình thi công hướng dẫn (Mỗi dòng là một bước, sử dụng dấu hai chấm ':' để in đậm tiêu đề bước)</label>
                <textarea
                  className="form-textarea"
                  value={guides}
                  onChange={(e) => setGuides(e.target.value)}
                  placeholder="VD:&#10;Khảo sát và Đo đạc: Đội ngũ thợ kỹ thuật đến trực tiếp công trình...&#10;Tư vấn và Chốt bản vẽ: Tư vấn phương án thiết kế..."
                  rows={5}
                />
              </div>

              {/* Technical Specifications */}
              <div className={styles.formGroup}>
                <label className="form-label">Mã sản phẩm</label>
                <input
                  type="text"
                  className="form-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="VD: CNK-XF-001"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Thương hiệu</label>
                <input
                  type="text"
                  className="form-input"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="VD: Xingfa Quảng Đông"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Màu sắc</label>
                <input
                  type="text"
                  className="form-input"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="VD: Ghi xám, Nâu cafe, Trắng sứ, Đen"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Chất liệu</label>
                <input
                  type="text"
                  className="form-input"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="VD: Nhôm Xingfa & Kính cường lực"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Tùy chọn hiển thị</label>
                <select
                  className="form-input"
                  value={optionName}
                  onChange={(e) => setOptionName(e.target.value)}
                >
                  <option value="TIÊU CHUẨN">TIÊU CHUẨN</option>
                  <option value="CAO CẤP">CAO CẤP</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Độ dày vật liệu</label>
                <input
                  type="text"
                  className="form-input"
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  placeholder="VD: Nhôm hệ 55, dày 1.4mm - 2.0mm"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Hệ phụ kiện</label>
                <input
                  type="text"
                  className="form-input"
                  value={hardware}
                  onChange={(e) => setHardware(e.target.value)}
                  placeholder="VD: Kinlong chính hãng nhập khẩu"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Bảo hành chính hãng</label>
                <input
                  type="text"
                  className="form-input"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="VD: 5 năm nhôm, 2 năm phụ kiện"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Cách âm cách nhiệt</label>
                <input
                  type="text"
                  className="form-input"
                  value={soundproof}
                  onChange={(e) => setSoundproof(e.target.value)}
                  placeholder="VD: Đạt tiêu chuẩn cách âm TCVN"
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Trạng thái hàng</label>
                <input
                  type="text"
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="VD: Còn hàng, Đo đạc tại công trình..."
                />
              </div>

              <div className={styles.formGroupFull} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input
                  type="checkbox"
                  id="isFeaturedCheckbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isFeaturedCheckbox" style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--color-primary)' }}>
                  Đặt làm sản phẩm nổi bật (Hiển thị ngoài Trang Chủ)
                </label>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={() => navigate('/admin/dashboard?tab=products')}
              >
                Hủy bỏ
              </button>
              <button type="submit" className={styles.btnSave} disabled={formLoading}>
                {formLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditProduct;
