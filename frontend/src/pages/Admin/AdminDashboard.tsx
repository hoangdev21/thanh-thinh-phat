import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Package,
  Inbox,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Phone,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import Loading from '../../components/Loading/Loading';
import {
  getAdminStats,
  getAdminContacts,
  updateContactStatus,
  getProducts,
  getCategories,
  deleteProduct,
} from '../../services/api';
import type { Category, Product, ContactRequest, AdminStats } from '../../types';
import styles from './AdminDashboard.module.css';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tabParam = searchParams.get('tab') as 'overview' | 'products' | 'contacts' | null;
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'contacts'>(tabParam || 'overview');

  // Sync tab state from URL parameter if it changes
  useEffect(() => {
    if (tabParam && ['overview', 'products', 'contacts'].includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'overview' | 'products' | 'contacts') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Stats State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Contacts State
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Products CRUD State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');



  // ==========================================
  // Data Fetching
  // ==========================================

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Lỗi khi tải thống kê:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const data = await getAdminContacts();
      setContacts(data);
    } catch (err) {
      console.error('Lỗi khi tải liên hệ:', err);
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchProductsAndCategories = async () => {
    setProductsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts({ limit: 100 }), // Fetch bulk
        getCategories(),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes);
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm/danh mục:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    if (activeTab === 'overview') {
      fetchStats();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    } else if (activeTab === 'products') {
      fetchProductsAndCategories();
    }
  }, [activeTab, isAuthenticated]);

  // ==========================================
  // Event Handlers
  // ==========================================

  // Contact status change
  const handleStatusChange = async (id: number, newStatus: 'new' | 'contacted' | 'done') => {
    try {
      await updateContactStatus(id, newStatus);
      if (activeTab === 'contacts') {
        fetchContacts();
      } else {
        fetchStats();
      }
    } catch (err) {
      alert('Không thể cập nhật trạng thái liên hệ');
    }
  };

  // Product Delete
  const handleDeleteProduct = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return;

    try {
      await deleteProduct(id);
      fetchProductsAndCategories();
    } catch (err) {
      alert('Không thể xóa sản phẩm');
    }
  };

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === '' || p.category_id.toString() === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, filterCategory]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Quyền truy cập bị từ chối</h2>
        <p>Vui lòng nhấp đúp vào chân trang để hiển thị bảng đăng nhập quản trị viên.</p>
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          {statsLoading ? (
            <Loading />
          ) : (
            <>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#3182ce' }}>
                    <Package size={24} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statNumber}>{stats?.totalProducts || 0}</span>
                    <span className={styles.statLabel}>Tổng Sản Phẩm</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#319795' }}>
                    <Filter size={24} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statNumber}>{stats?.totalCategories || 0}</span>
                    <span className={styles.statLabel}>Danh Mục Sản Phẩm</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#dd6b20' }}>
                    <Inbox size={24} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statNumber}>{stats?.totalContacts || 0}</span>
                    <span className={styles.statLabel}>Yêu Cầu Liên Hệ</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#e53e3e' }}>
                    <Mail size={24} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statNumber}>{stats?.newContacts || 0}</span>
                    <span className={styles.statLabel}>Liên Hệ Mới</span>
                  </div>
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Yêu Cầu Liên Hệ Gần Đây</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('contacts')}>
                  Xem Tất Cả
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Khách Hàng</th>
                      <th>Số Điện Thoại</th>
                      <th>Email</th>
                      <th>Sản Phẩm Quan Tâm</th>
                      <th>Trạng Thái</th>
                      <th>Ngày Gửi</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentContacts && stats.recentContacts.length > 0 ? (
                      stats.recentContacts.map((contact) => (
                        <tr key={contact.id}>
                          <td><strong>{contact.name}</strong></td>
                          <td>
                            <a href={`tel:${contact.phone}`} className={styles.linkPhone}>
                              <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                              {contact.phone}
                            </a>
                          </td>
                          <td>{contact.email || '-'}</td>
                          <td>{contact.product_name || 'Liên hệ chung'}</td>
                          <td>
                            <span
                              className={`${styles.badge} ${
                                contact.status === 'new'
                                  ? styles.badgeNew
                                  : contact.status === 'contacted'
                                  ? styles.badgeContacted
                                  : styles.badgeDone
                              }`}
                            >
                              {contact.status === 'new'
                                ? 'Mới'
                                : contact.status === 'contacted'
                                ? 'Đã liên hệ'
                                : 'Hoàn thành'}
                            </span>
                          </td>
                          <td>{new Date(contact.created_at).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <select
                              value={contact.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  contact.id,
                                  e.target.value as 'new' | 'contacted' | 'done'
                                )
                              }
                              className="form-input"
                              style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                            >
                              <option value="new">Mới</option>
                              <option value="contacted">Đã liên hệ</option>
                              <option value="done">Hoàn thành</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                          Chưa có yêu cầu liên hệ nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Danh Sách Sản Phẩm ({filteredProducts.length})</h2>
            <button className="btn btn-primary" onClick={() => navigate('/admin/products/add')}>
              <Plus size={16} /> Thêm Sản Phẩm
            </button>
          </div>

          <div className={styles.searchFilterRow}>
            <div className={styles.filterGroup}>
              <label className="form-label" style={{ marginBottom: '4px' }}>Tìm kiếm</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-light)',
                  }}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className="form-label" style={{ marginBottom: '4px' }}>Danh mục</label>
              <select
                className="form-input"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {productsLoading ? (
            <Loading />
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Danh Mục</th>
                    <th>Khoảng Giá</th>
                    <th>Nổi Bật</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.thumbnail_url || p.image_url}
                            alt={p.name}
                            className={styles.productThumb}
                          />
                        </td>
                        <td>
                          <strong>{p.name}</strong>
                        </td>
                        <td>{p.category_name}</td>
                        <td><span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>{p.price_range}</span></td>
                        <td>
                          {p.is_featured ? (
                            <span className={styles.badge} style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0' }}>
                              Nổi bật
                            </span>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>Thường</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionsGroup}>
                            <button
                              className={`${styles.actionBtn} ${styles.actionEdit}`}
                              onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                            >
                              <Edit2 size={12} /> Sửa
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.actionDelete}`}
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                            >
                              <Trash2 size={12} /> Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>
                        Không tìm thấy sản phẩm nào phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. CONTACTS TAB */}
      {activeTab === 'contacts' && (
        <div>
          {contactsLoading ? (
            <Loading />
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Khách Hàng</th>
                    <th>Số Điện Thoại</th>
                    <th>Email</th>
                    <th>Nội Dung Yêu Cầu</th>
                    <th>Sản Phẩm Quan Tâm</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Nhận</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <tr key={contact.id}>
                        <td>
                          <strong>{contact.name}</strong>
                        </td>
                        <td>
                          <a href={`tel:${contact.phone}`} className={styles.linkPhone}>
                            <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {contact.phone}
                          </a>
                        </td>
                        <td>{contact.email || '-'}</td>
                        <td>
                          <p style={{ maxWidth: '300px', fontSize: '0.85rem', margin: 0, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                            {contact.message}
                          </p>
                        </td>
                        <td>{contact.product_name || 'Liên hệ chung'}</td>
                        <td>
                          <select
                            value={contact.status}
                            onChange={(e) =>
                              handleStatusChange(
                                contact.id,
                                e.target.value as 'new' | 'contacted' | 'done'
                              )
                            }
                            className={`form-input ${
                              contact.status === 'new'
                                ? styles.selectNew
                                : contact.status === 'contacted'
                                ? styles.selectContacted
                                : styles.selectDone
                            }`}
                            style={{ padding: '6px 10px', fontSize: '0.85rem', width: 'auto', fontWeight: 'bold' }}
                          >
                            <option value="new" style={{ color: '#856404', fontWeight: 'bold' }}>Mới</option>
                            <option value="contacted" style={{ color: '#0c5460', fontWeight: 'bold' }}>Đã liên hệ</option>
                            <option value="done" style={{ color: '#155724', fontWeight: 'bold' }}>Hoàn thành</option>
                          </select>
                        </td>
                        <td>{new Date(contact.created_at).toLocaleDateString('vi-VN')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                        Chưa có yêu cầu liên hệ nào gửi tới xưởng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
