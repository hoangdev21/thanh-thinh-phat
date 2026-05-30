import { useState } from 'react';
import { Send } from 'lucide-react';
import { submitContact } from '../../services/api';
import type { ContactFormData } from '../../types';
import styles from './ContactForm.module.css';

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
    if (!/^(0[0-9]{9,10})$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung';
    } else if (formData.message.trim().length < 3) {
      newErrors.message = 'Nội dung phải có ít nhất 3 ký tự';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await submitContact(formData);
      setSuccess(res.message);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch {
      setApiError('Không thể gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {success && <div className={styles.successMsg}>{success}</div>}
      {apiError && <div className={styles.errorMsg}>{apiError}</div>}

      <div className="form-group">
        <label className="form-label">Họ và Tên *</label>
        <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nhập họ và tên" />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Số Điện Thoại *</label>
        <input className="form-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="VD: 0901234567" />
        {errors.phone && <p className="form-error">{errors.phone}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Nội Dung *</label>
        <textarea className="form-textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Nhập nội dung yêu cầu..." />
        {errors.message && <p className="form-error">{errors.message}</p>}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Đang gửi...' : <><Send size={16} /> Gửi Yêu Cầu</>}
      </button>
    </form>
  );
};

export default ContactForm;
