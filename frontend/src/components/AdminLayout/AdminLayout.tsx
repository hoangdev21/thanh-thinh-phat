import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Inbox, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  activeTab: 'overview' | 'products' | 'contacts';
  onTabChange: (tab: 'overview' | 'products' | 'contacts') => void;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, onTabChange, children }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'overview' as const, label: 'Thống Kê', icon: <LayoutDashboard size={20} /> },
    { id: 'products' as const, label: 'Sản Phẩm', icon: <Package size={20} /> },
    { id: 'contacts' as const, label: 'Liên Hệ', icon: <Inbox size={20} /> },
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Tổng Quan Thống Kê';
      case 'products':
        return 'Quản Lý Sản Phẩm';
      case 'contacts':
        return 'Danh Sách Liên Hệ';
      default:
        return 'Trang Quản Trị';
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoIcon}>TTP</div>
          <span className={styles.brand}>ADMIN PANEL</span>
        </div>

        <nav className={styles.sidebarMenu}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.menuItem} ${activeTab === item.id ? styles.menuItemActive : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.icon}
              <span className={styles.menuText}>{item.label}</span>
            </div>
          ))}

          <div className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            <span className={styles.logoutText}>Đăng Xuất</span>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={styles.contentArea}>
        {/* TopBar */}
        <header className={styles.topBar}>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          <div className={styles.adminProfile}>
            <div className={styles.profileAvatar}>
              {admin?.username?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <span>Xin chào, {admin?.username || 'Quản trị viên'}</span>
          </div>
        </header>

        {/* Dynamic Main view */}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
