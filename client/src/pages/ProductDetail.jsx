import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductBySlug } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import ReviewSection from '../components/ReviewSection';
import Rating from '../components/Rating';

const categoryColors = {
  Smartphone: 'var(--primary)',
  Laptop: 'var(--info)',
  Wearable: 'var(--teal)',
  Accessoire: 'var(--purple)',
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Produit non trouvé' : 'Erreur serveur');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--primary)] text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-4xl mb-4">😕</div>
        <p className="text-[var(--text-muted)] mb-4">{error || 'Produit non trouvé'}</p>
        <Link to="/catalogue" className="text-[var(--primary)] hover:underline">
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  const liked = isFavorite(product._id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link to="/" className="hover:text-[var(--primary)] transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/catalogue" className="hover:text-[var(--primary)] transition-colors">Catalogue</Link>
          <span>/</span>
          <Link
            to={`/catalogue?category=${product.category}`}
            className="hover:text-[var(--primary)] transition-colors"
          >
            {product.category}s
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden flex items-center justify-center h-96 lg:h-[500px]"
          >
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-8xl">📦</div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Brand + Category */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${categoryColors[product.category]}20`,
                  color: categoryColors[product.category],
                }}
              >
                {product.category}
              </span>
              <span className="text-[var(--text-muted)] text-sm">{product.brand}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  product.inStock
                    ? 'bg-[var(--success)]/10 text-[var(--success)]'
                    : 'bg-[var(--error)]/10 text-[var(--error)]'
                }`}
              >
                {product.inStock ? '✓ En stock' : '✗ Rupture'}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mb-6">
              <Rating value={product.rating} count={product.numReviews} size="lg" />
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-[var(--primary)]">
                {product.price.toLocaleString('fr-FR')} €
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                Description
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 mb-8">
              <button className="flex-1 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors cursor-pointer">
                Ajouter au panier
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => toggleFavorite(product._id)}
                  className={`w-12 h-12 flex items-center justify-center border rounded-lg transition-colors cursor-pointer text-xl ${
                    liked
                      ? 'bg-[var(--error)]/10 border-[var(--error)] text-[var(--error)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--error)] hover:text-[var(--error)]'
                  }`}
                >
                  {liked ? '♥' : '♡'}
                </button>
              )}
            </div>

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">
                  Caractéristiques
                </h3>
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-4 py-3 ${
                        i % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-base)]'
                      }`}
                    >
                      <span className="text-sm text-[var(--text-muted)] capitalize">{key}</span>
                      <span className="text-sm text-[var(--text-primary)] font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product._id} />
    </motion.div>
  );
};

export default ProductDetail;