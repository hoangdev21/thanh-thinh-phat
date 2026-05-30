import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/san-pham/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={product.thumbnail_url || product.image_url}
          alt={product.name}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{product.price_range}</p>
        <span className={styles.link}>
          Xem Chi Tiết <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
