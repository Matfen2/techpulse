import { Link } from 'react-router-dom';

const categoryColors = {
  Smartphone: 'var(--primary)',
  Laptop: 'var(--info)',
  Wearable: 'var(--teal)',
  Accessoire: 'var(--purple)',
};

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/catalogue/${product.slug}`}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--primary)] transition-all duration-300 group"
    >
      {/* Image */}
      <div className="h-48 bg-[var(--bg-base)] flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-4xl">📦</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{
              backgroundColor: `${categoryColors[product.category]}20`,
              color: categoryColors[product.category],
            }}
          >
            {product.category}
          </span>
          <span className="text-xs text-[var(--text-muted)]">{product.brand}</span>
        </div>

        {/* Name */}
        <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-[var(--warning)] text-sm">★</span>
          <span className="text-xs text-[var(--text-muted)]">
            {product.rating > 0 ? product.rating.toFixed(1) : 'N/A'} ({product.numReviews} avis)
          </span>
        </div>

        {/* Price + Stock */}
        <div className="flex items-center justify-between">
          <span className="text-[var(--primary)] font-bold text-lg">
            {product.price.toLocaleString('fr-FR')} €
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
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
  );
};

export default ProductCard;