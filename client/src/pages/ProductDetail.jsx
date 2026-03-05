import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductBySlug } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import ReviewSection from '../components/ReviewSection';
import Rating from '../components/Rating';

const categoryConfig = {
  Smartphone: { color: 'var(--orange)', icon: '📱' },
  Laptop: { color: 'var(--info)', icon: '💻' },
  Wearable: { color: '#14b8a6', icon: '⌚' },
  Accessoire: { color: '#a855f7', icon: '🎧' },
};

/* ── Skeleton ── */
const DetailSkeleton = () => (
  <div className="min-h-screen bg-[var(--bg-deep)] py-4 sm:py-8 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="h-4 w-48 bg-[var(--bg-card)] rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl h-56 sm:h-72 lg:h-[500px] animate-pulse" />
        <div className="space-y-4 animate-pulse">
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-[var(--bg-card)] rounded-full" />
            <div className="h-6 w-16 bg-[var(--bg-card)] rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-[var(--bg-card)] rounded" />
          <div className="h-5 w-32 bg-[var(--bg-card)] rounded" />
          <div className="h-10 w-40 bg-[var(--bg-card)] rounded" />
          <div className="h-20 w-full bg-[var(--bg-card)] rounded" />
          <div className="h-12 w-full bg-[var(--bg-card)] rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);

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

  if (loading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[var(--bg-deep)] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-4xl sm:text-5xl mb-4">😕</div>
          <p className="text-[var(--text-muted)] mb-4 text-xs sm:text-sm font-qaranta">{error || 'Produit non trouvé'}</p>
          <Link to="/catalogue" className="text-[var(--orange)] hover:underline font-qaranta text-xs sm:text-sm">← Retour au catalogue</Link>
        </motion.div>
      </div>
    );
  }

  const liked = isFavorite(product._id);
  const inCart = isInCart(product._id);
  const cat = categoryConfig[product.category] || { color: 'var(--orange)', icon: '📦' };

  const handleAddToCart = () => {
    if (inCart) return;
    addToCart({
      _id: product._id,
      title: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      brand: product.brand,
      slug: product.slug,
      type: 'product',
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-[var(--bg-deep)] min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-4">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs lg:text-sm text-[var(--text-muted)] overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[var(--orange)] transition-colors shrink-0 font-qaranta">Accueil</Link>
          <span className="shrink-0">/</span>
          <Link to="/catalogue" className="hover:text-[var(--orange)] transition-colors shrink-0 font-qaranta">Catalogue</Link>
          <span className="shrink-0">/</span>
          <Link to={`/catalogue?category=${product.category}`} className="hover:text-[var(--orange)] transition-colors shrink-0 font-qaranta">
            {product.category}s
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-[var(--text)] truncate font-qaranta">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-4 pb-6 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-12">

          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden relative h-56 sm:h-72 lg:h-[520px] lg:sticky lg:top-20"
          >
            {product.image ? (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-[var(--bg-base)] animate-pulse" />
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl sm:text-7xl lg:text-8xl">{cat.icon}</div>
            )}

            {/* Favorite button overlay */}
            {isAuthenticated && (
              <button
                onClick={() => toggleFavorite(product._id)}
                className={`absolute top-2.5 right-2.5 sm:top-4 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center backdrop-blur-md transition-all cursor-pointer text-base sm:text-lg ${
                  liked
                    ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                    : 'bg-black/30 border border-white/10 text-white/70 hover:text-red-400 hover:border-red-500/40'
                }`}
              >
                {liked ? '♥' : '♡'}
              </button>
            )}
          </motion.div>

          {/* ── Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4 sm:space-y-5 lg:space-y-6"
          >
            {/* Badges */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span
                className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium font-qaranta"
                style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
              >
                {product.category}
              </span>
              <span className="text-[var(--text-muted)] text-[10px] sm:text-xs lg:text-sm font-qaranta">{product.brand}</span>
              <span className={`text-[9px] sm:text-xs px-2 py-0.5 rounded-full font-medium font-qaranta ${
                product.inStock
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {product.inStock ? '✓ En stock' : '✗ Rupture'}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-[var(--text)] leading-tight font-request">
              {product.name}
            </h1>

            {/* Rating */}
            <Rating value={product.rating} count={product.numReviews} size="lg" />

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl lg:text-4xl font-bold text-[var(--orange)] font-request">
                {product.price.toLocaleString('fr-FR')} €
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-[10px] sm:text-xs font-semibold text-[var(--text-muted)] mb-1.5 sm:mb-2 uppercase tracking-wider font-request">Description</h3>
              <p className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed font-qaranta">{product.description}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: inCart ? 1 : 1.02 }}
                whileTap={{ scale: inCart ? 1 : 0.98 }}
                onClick={handleAddToCart}
                disabled={inCart}
                className={`flex-1 py-2.5 sm:py-3 font-semibold rounded-xl transition-all cursor-pointer text-xs sm:text-sm lg:text-base font-qaranta ${
                  inCart
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white hover:shadow-xl hover:shadow-[var(--orange)]/25'
                }`}
              >
                {inCart ? '✓ Dans le panier' : '🛒 Ajouter au panier'}
              </motion.button>
              {isAuthenticated && (
                <button
                  onClick={() => toggleFavorite(product._id)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border rounded-xl transition-all cursor-pointer text-base sm:text-lg shrink-0 ${
                    liked
                      ? 'bg-red-500/10 border-red-500/40 text-red-400'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-red-500/40 hover:text-red-400'
                  }`}
                >
                  {liked ? '♥' : '♡'}
                </button>
              )}
            </div>

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="text-[10px] sm:text-xs font-semibold text-[var(--text-muted)] mb-2 sm:mb-3 uppercase tracking-wider font-request">Caractéristiques</h3>
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs lg:text-sm ${
                        i % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-deep)]'
                      }`}
                    >
                      <span className="text-[var(--text-muted)] capitalize font-qaranta">{key}</span>
                      <span className="text-[var(--text)] font-medium font-qaranta">{value}</span>
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