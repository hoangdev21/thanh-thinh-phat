import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { path: '/', label: 'Trang Chủ' },
    { path: '/san-pham', label: 'Sản Phẩm' },
    { path: '/gioi-thieu', label: 'Giới Thiệu' },
    { path: '/lien-he', label: 'Liên Hệ' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <img 
            src={logoImg} 
            alt="Logo Thành Thịnh Phát" 
            className={styles.logoImg} 
          />
          <span className={styles.logoText}>THÀNH THỊNH PHÁT</span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.headerInfo}>
          <div className={styles.infoBlock}>
            <MapPin size={14} className={styles.infoIcon} />
            <span className={styles.infoVal}>Cửa Việt</span>
          </div>
          <div className={styles.infoDivider}></div>
          <a href="tel:0901234567" className={styles.infoBlock}>
            <Phone size={14} className={styles.infoIcon} />
            <span className={styles.infoVal}>0901.234.567</span>
          </a>
        </div>

        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={closeMenu}
          >
            {item.label}
          </NavLink>
        ))}
        <div className={styles.mobileContactInfo}>
          <div className={styles.mobileContactItem}>
            <MapPin size={16} />
            <span>Cửa Việt</span>
          </div>
          <a href="tel:0901234567" className={styles.mobileContactItem}>
            <Phone size={16} />
            <span>0901.234.567</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
