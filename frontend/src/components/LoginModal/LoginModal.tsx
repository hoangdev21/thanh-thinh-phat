import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginModal.module.css';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setLoginModalOpen, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      setUsername('');
      setPassword('');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setUsername('');
    setPassword('');
    setLoginModalOpen(false);
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Đóng">
          <X size={20} />
        </button>

        <h2 className={styles.title}>Đăng Nhập Admin</h2>
        <p className={styles.subtitle}>Cổng quản trị Nhôm Kính Thành Thịnh Phát</p>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tài khoản</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên đăng nhập"
                required
                style={{ paddingLeft: '36px' }}
              />
              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingLeft: '36px', paddingRight: '40px' }}
              />
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-light)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
