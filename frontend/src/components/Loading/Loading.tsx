import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.spinner} />
      <p className={styles.text}>Đang tải...</p>
    </div>
  );
};

export default Loading;
