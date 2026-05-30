import { CheckCircle } from 'lucide-react';
import styles from './About.module.css';

const AboutPage = () => {
  const stats = [
    { number: '10+', label: 'Năm Kinh Nghiệm' },
    { number: '500+', label: 'Dự Án Hoàn Thành' },
    { number: '1000+', label: 'Khách Hàng Hài Lòng' },
    { number: '20+', label: 'Đội Ngũ Thợ Lành Nghề' },
  ];

  const commitments = [
    { title: 'Vật liệu chính hãng', desc: 'Cam kết sử dụng 100% vật liệu nhôm kính nhập khẩu chính hãng, có chứng nhận chất lượng.' },
    { title: 'Báo giá minh bạch', desc: 'Báo giá chi tiết, rõ ràng từng hạng mục, không phát sinh chi phí ngoài hợp đồng.' },
    { title: 'Thi công đúng tiến độ', desc: 'Cam kết hoàn thành đúng thời gian đã thỏa thuận, đảm bảo tiến độ công trình.' },
    { title: 'Bảo hành dài hạn', desc: 'Bảo hành sản phẩm từ 12 đến 60 tháng. Hỗ trợ bảo trì trọn đời.' },
    { title: 'Tư vấn miễn phí', desc: 'Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng lựa chọn sản phẩm phù hợp.' },
    { title: 'Đo đạc tận nơi', desc: 'Miễn phí khảo sát và đo đạc tại công trình trong khu vực TP.HCM và các tỉnh lân cận.' },
  ];

  return (
    <main className={styles.aboutPage}>
      <div className="page-header">
        <h1>Về Nhôm Kính Thành Thịnh Phát</h1>
        <p>Uy tín — Chất lượng — Tận tâm</p>
      </div>

      <section className={styles.introSection}>
        <div className={styles.introInner}>
          <p className={styles.introText}>
            <strong>Nhôm Kính Thành Thịnh Phát</strong> được thành lập với sứ mệnh mang đến những sản phẩm nhôm kính chất lượng cao, thiết kế hiện đại cho mọi công trình từ dân dụng đến thương mại.
          </p>
          <p className={styles.introText}>
            Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác tin cậy của hàng nghìn khách hàng. Đội ngũ thợ tay nghề cao, được đào tạo bài bản cùng hệ thống máy móc hiện đại giúp chúng tôi đáp ứng mọi yêu cầu của khách hàng.
          </p>
          <p className={styles.introText}>
            Chúng tôi chuyên cung cấp và thi công các sản phẩm: cửa nhôm kính, vách kính cường lực, lan can kính, mái kính, cửa cuốn và phòng tắm kính với đa dạng mẫu mã và giá cả cạnh tranh.
          </p>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.commitSection}>
        <div className="section-header">
          <h2 className="section-title">Cam Kết Của Chúng Tôi</h2>
          <div className="section-divider" />
        </div>
        <div className={styles.commitGrid}>
          {commitments.map((item, i) => (
            <div key={i} className={styles.commitItem}>
              <div className={styles.commitIcon}>
                <CheckCircle size={20} />
              </div>
              <div className={styles.commitText}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
