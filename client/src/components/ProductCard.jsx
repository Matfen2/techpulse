import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const categoryColors = {
  Smartphone: 'var(--primary)',
  Laptop: 'var(--info)',
  Wearable: 'var(--teal)',
  Accessoire: 'var(--purple)',
};

const categoryIcons = {
  Smartphone: '📱',
  Laptop: '💻',
  Wearable: '⌚',
  Accessoire: '🎧',
};

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(product._id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleFavorite(product._id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        to={`/catalogue/${product.slug}`}
        className="block bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--primary)]/50 transition-all duration-300 group relative hover:shadow-lg hover:shadow-[var(--primary)]/5"
      >
        {/* Favorite button */}
        {isAuthenticated && (
          <motion.button
            onClick={handleFavorite}
            whileTap={{ scale: 0.8 }}
            className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer backdrop-blur-sm ${
              liked
                ? 'bg-[var(--error)]/15 border-[var(--error)]/50 text-[var(--error)]'
                : 'bg-[var(--bg-base)]/70 border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--error)] hover:text-[var(--error)]'
            }`}
          >
            {liked ? '♥' : '♡'}
          </motion.button>
        )}

        {/* Image */}
        <div className="h-40 sm:h-48 bg-[var(--bg-base)] flex items-center justify-center overflow-hidden relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-5xl sm:text-6xl opacity-80 group-hover:scale-110 transition-transform duration-500">
              {categoryIcons[product.category] || '📦'}
            </div>
          )}

          {/* Gradient overlay bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Category + Brand */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium"
              style={{
                backgroundColor: `${categoryColors[product.category]}15`,
                color: categoryColors[product.category],
              }}
            >
              {product.category}
            </span>
            <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">{product.brand}</span>
          </div>

          {/* Name */}
          <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors duration-200 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.round(product.rating)
                      ? 'text-[var(--warning)]'
                      : 'text-[var(--border)]'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">
              {product.rating > 0 ? product.rating.toFixed(1) : 'N/A'} ({product.numReviews} avis)
            </span>
          </div>

          {/* Price + Stock */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/50">
            <span className="text-[var(--primary)] font-bold text-base sm:text-lg">
              {product.price.toLocaleString('fr-FR')} €
            </span>
            <span
              className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
                product.inStock
                  ? 'bg-[var(--success)]/10 text-[var(--success)]'
                  : 'bg-[var(--error)]/10 text-[var(--error)]'
              }`}
            >
              {product.inStock ? 'En stock' : 'Rupture'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;