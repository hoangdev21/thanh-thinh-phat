import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '../../components/ContactForm/ContactForm';
import styles from './Contact.module.css';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <MapPin size={22} />,
      title: 'Địa Chỉ',
      detail: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
    },
    {
      icon: <Phone size={22} />,
      title: 'Điện Thoại',
      detail: '0901.234.567 — 0987.654.321',
    },
    {
      icon: <Mail size={22} />,
      title: 'Email',
      detail: 'info@thanhthinhphat.vn',
    },
    {
      icon: <Clock size={22} />,
      title: 'Giờ Làm Việc',
      detail: 'Thứ 2 — Thứ 7: 7:30 — 17:30',
    },
  ];

  return (
    <main className={styles.contactPage}>
      <div className="page-header">
        <h1>Liên Hệ Với Chúng Tôi</h1>
        <p>Hãy liên hệ để được tư vấn và báo giá miễn phí</p>
      </div>

      <div className={styles.contactContent}>
        <div className={styles.contactGrid}>
          <div>
            <h2 style={{ marginBottom: '24px', color: 'var(--color-primary)' }}>Gửi Yêu Cầu</h2>
            <ContactForm />
          </div>
          <div>
            <h2 style={{ marginBottom: '24px', color: 'var(--color-primary)' }}>Thông Tin Liên Hệ</h2>
            <div className={styles.infoCards}>
              {contactInfo.map((info, i) => (
                <div key={i} className={styles.infoCard}>
                  <div className={styles.infoIcon}>{info.icon}</div>
                  <div className={styles.infoContent}>
                    <h3>{info.title}</h3>
                    <p>{info.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mapSection}>
          <iframe
            className={styles.mapFrame}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6696584237116!2d106.66488!3d10.762622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzQ1LjQiTiAxMDbCsDM5JzUzLjYiRQ!5e0!3m2!1svi!2svn!4v1234567890"
            allowFullScreen
            loading="lazy"
            title="Bản đồ Nhôm Kính Thành Thịnh Phát"
          />
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
