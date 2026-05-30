import zaloImg from '../../assets/zalo.png';
import styles from './ZaloWidget.module.css';

const ZaloWidget = () => {
  return (
    <div className={styles.zaloContainer}>
      <div className={styles.zaloWrapper}>
        {/* Pulsing Back Rings */}
        <div className={styles.pulseRing} />
        <div className={styles.pulseRing2} />

        {/* Float Zalo Button */}
        <a 
          href="https://zalo.me/0337982569" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.zaloBtn}
          title="Chat qua Zalo"
          aria-label="Liên hệ qua Zalo"
        >
          {/* Official Zalo PNG Image */}
          <img 
            src={zaloImg} 
            alt="Zalo Logo" 
            className={styles.zaloIconImg} 
          />
        </a>
      </div>
    </div>
  );
};

export default ZaloWidget;
