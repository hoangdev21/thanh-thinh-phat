import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';
import { getProducts, getCategories } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import styles from './Products.module.css';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const limit = 12;

  const [searchVal, setSearchVal] = useState(searchQuery);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data: categories } = useApi(() => getCategories(), []);
  
  const categoryId = useMemo(() => {
    if (!categorySlug || !categories) return undefined;
    const cat = categories.find(c => c.slug === categorySlug);
    return cat?.id;
  }, [categorySlug, categories]);

  const { data: productsData, loading } = useApi(
    () => getProducts({ category_id: categoryId, page, limit, search: searchQuery }),
    [categoryId, page, searchQuery]
  );

  // Sync searchVal state with URL search param when it changes externally
  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  // Debounced update to the URL search parameter
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchVal !== searchQuery) {
        const newParams = new URLSearchParams(searchParams);
        if (searchVal.trim()) {
          newParams.set('search', searchVal.trim());
        } else {
          newParams.delete('search');
        }
        newParams.set('page', '1'); // Reset to page 1 on new search
        setSearchParams(newParams);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchVal, searchQuery, searchParams, setSearchParams]);

  const handleCategoryChange = (slug: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1'); // Reset to page 1 on category change
    setSearchParams(newParams);
  };

  const setPage = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', p.toString());
    setSearchParams(newParams);
  };

  const activeCategoryName = useMemo(() => {
    if (!categorySlug || !categories) return 'Tất cả sản phẩm';
    const cat = categories.find(c => c.slug === categorySlug);
    return cat ? cat.name : 'Tất cả sản phẩm';
  }, [categorySlug, categories]);

  const totalPages = productsData?.pagination?.totalPages || 1;

  return (
    <main className={styles.productsPage}>
      <div className="page-header">
        <h1>Sản Phẩm Của Chúng Tôi</h1>
        <p>Khám phá các sản phẩm nhôm kính chất lượng cao</p>
      </div>

      <div className="container">
        <div className={styles.layoutWrapper}>
          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            className={styles.mobileFilterToggle}
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <span className={styles.toggleText}>
              <Filter size={18} />
              <span>Bộ lọc & Tìm kiếm</span>
              {(categorySlug || searchQuery) && (
                <span className={styles.activeBadge}>
                  {categorySlug ? activeCategoryName : 'Đang tìm kiếm'}
                </span>
              )}
            </span>
            {isMobileFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Sidebar Filter on the left */}
          <aside className={`${styles.sidebar} ${isMobileFilterOpen ? styles.sidebarOpen : ''}`}>
            {/* Search Widget */}
            <div className={styles.widget}>
              <h3 className={styles.widgetTitle}>Tìm kiếm sản phẩm</h3>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className={styles.searchInput}
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => setSearchVal('')}
                    className={styles.clearBtn}
                    aria-label="Xóa tìm kiếm"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories Widget */}
            <div className={styles.widget}>
              <h3 className={styles.widgetTitle}>Danh mục sản phẩm</h3>
              <div className={styles.categoryList}>
                {/* Tất cả Option */}
                <label className={styles.categoryOption}>
                  <input
                    type="radio"
                    name="category"
                    checked={!categorySlug}
                    onChange={() => handleCategoryChange(null)}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioIndicator} />
                  <span className={styles.categoryName}>Tất cả sản phẩm</span>
                </label>

                {/* Individual Categories with Custom Radio Selectors */}
                {categories?.map((cat) => (
                  <label key={cat.id} className={styles.categoryOption}>
                    <input
                      type="radio"
                      name="category"
                      checked={categorySlug === cat.slug}
                      onChange={() => handleCategoryChange(cat.slug)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioIndicator} />
                    <span className={styles.categoryName}>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content grid on the right */}
          <div className={styles.contentArea}>
            <div className={styles.contentHeader}>
              <h2 className={styles.categoryTitle}>{activeCategoryName}</h2>
              {productsData?.pagination && (
                <span className={styles.resultsCount}>
                  Hiển thị {productsData.data.length} trên {productsData.pagination.total} sản phẩm
                </span>
              )}
            </div>

            <section className={styles.productsSection}>
              {loading ? (
                <Loading />
              ) : productsData?.data && productsData.data.length > 0 ? (
                <>
                  <div className="product-grid">
                    {productsData.data.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <Package size={48} className={styles.emptyIcon} />
                  <p>Không tìm thấy sản phẩm nào phù hợp</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;

