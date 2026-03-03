import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getListingBySlug } from '../services/productService';

const conditionConfig = {
  'Comme neuf': { color: '#10b981', label: 'Comme neuf' },
  'Très bon état': { color: '#06b6d4', label: 'Très bon état' },
  'Bon état': { color: '#f59e0b', label: 'Bon état' },
  'État correct': { color: '#6b7280', label: 'État correct' },
};

/* ── Skeleton ── */
const DetailSkeleton = () => (
  <div className="min-h-screen bg-[var(--bg-deep)] py-4 sm:py-8 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="h-4 w-48 bg-[var(--bg-card)] rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        <div className="space-y-4 animate-pulse">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl h-64 sm:h-80" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-[var(--bg-card)] rounded-lg" />
            ))}
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl h-48" />
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-[var(--bg-card)] rounded-full" />
            <div className="h-6 w-20 bg-[var(--bg-card)] rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-[var(--bg-card)] rounded" />
          <div className="h-10 w-40 bg-[var(--bg-card)] rounded" />
          <div className="h-20 w-full bg-[var(--bg-card)] rounded" />
          <div className="h-12 w-full bg-[var(--bg-card)] rounded-xl" />
          <div className="h-24 w-full bg-[var(--bg-card)] rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const ListingDetail = () => {
  const { slug } = useParams();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await getListingBySlug(slug);
        setListing(data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Annonce non trouvée' : 'Erreur serveur');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [slug]);

  if (loading) return <DetailSkeleton />;

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[var(--bg-deep)] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-[var(--text-muted)] mb-4 text-sm">{error || 'Annonce non trouvée'}</p>
          <Link to="/marketplace" className="text-[var(--orange)] hover:underline text-sm">← Retour à la marketplace</Link>
        </motion.div>
      </div>
    );
  }

  const cond = conditionConfig[listing.condition] || { color: '#6b7280', label: listing.condition };
  const inCart = isInCart(listing._id);

  const statusConfig = {
    active: { cls: 'bg-emerald-500/10 text-emerald-400', label: 'Active' },
    pending: { cls: 'bg-amber-500/10 text-amber-400', label: 'En attente' },
    sold: { cls: 'bg-sky-500/10 text-sky-400', label: 'Vendu' },
    rejected: { cls: 'bg-red-500/10 text-red-400', label: 'Rejetée' },
  };
  const st = statusConfig[listing.status] || statusConfig.pending;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-[var(--bg-deep)] min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-[var(--text-muted)] overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[var(--orange)] transition-colors shrink-0">Accueil</Link>
          <span className="shrink-0">/</span>
          <Link to="/marketplace" className="hover:text-[var(--orange)] transition-colors shrink-0">Marketplace</Link>
          <span className="shrink-0">/</span>
          <span className="text-[var(--text)] truncate">{listing.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

          {/* ── Media column ── */}
          <div className="space-y-3 sm:space-y-4">

            {/* Main image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden h-56 sm:h-72 lg:h-96 relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  {listing.images?.[activeImage] ? (
                    <img src={listing.images[activeImage].url} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl sm:text-8xl">📦</div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Image counter */}
              {listing.images?.length > 1 && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-[10px] sm:text-xs font-mono">
                  {activeImage + 1}/{listing.images.length}
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {listing.images?.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      i === activeImage
                        ? 'border-[var(--orange)] shadow-lg shadow-[var(--orange)]/20'
                        : 'border-[var(--border)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            {listing.video?.url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden"
              >
                <div className="px-4 py-2.5 sm:py-3 border-b border-[var(--border)] flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text)]">🎥 Vidéo de vérification</span>
                  {listing.videoVerified && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] sm:text-xs font-medium">✓ Vérifiée</span>
                  )}
                </div>
                <video src={listing.video.url} controls className="w-full max-h-56 sm:max-h-72 lg:max-h-80" />
              </motion.div>
            )}
          </div>

          {/* ── Info column ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-5 sm:space-y-6"
          >
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-[var(--orange)]/10 text-[var(--orange)] rounded-full text-xs font-medium">
                {listing.category}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${cond.color}20`, color: cond.color }}
              >
                {cond.label}
              </span>
              {listing.videoVerified && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                  ✓ Vidéo vérifiée
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${st.cls}`}>
                {st.label}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text)] leading-tight">
              {listing.title}
            </h1>

            {/* Price */}
            <div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--orange)]">
                {listing.price.toLocaleString('fr-FR')} €
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Description</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{listing.description}</p>
            </div>

            {/* Location */}
            {listing.location && (
              <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                <span>📍</span>
                <span>{listing.location}</span>
              </div>
            )}

            {/* Action button */}
            <div className="flex gap-3">
              {isAuthenticated ? (
                <motion.button
                  onClick={() => addToCart(listing)}
                  disabled={inCart}
                  whileHover={{ scale: inCart ? 1 : 1.02 }}
                  whileTap={{ scale: inCart ? 1 : 0.98 }}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all cursor-pointer ${
                    inCart
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white hover:shadow-xl hover:shadow-[var(--orange)]/25'
                  }`}
                >
                  {inCart ? '✓ Dans le panier' : '🛒 Ajouter au panier'}
                </motion.button>
              ) : (
                <Link
                  to="/login"
                  className="flex-1 py-3 bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white rounded-xl font-semibold text-center text-sm sm:text-base hover:shadow-xl hover:shadow-[var(--orange)]/25 transition-all"
                >
                  Se connecter pour acheter
                </Link>
              )}
            </div>

            {/* Seller card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 sm:p-5">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wider">Vendeur</h3>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--orange)]/10 flex items-center justify-center text-[var(--orange)] font-bold text-sm sm:text-lg shrink-0">
                  {listing.seller?.firstName?.[0]}{listing.seller?.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-[var(--text)] font-semibold text-sm sm:text-base truncate">
                    {listing.seller?.firstName} {listing.seller?.lastName}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[var(--text-muted)] flex-wrap">
                    {listing.seller?.sellerRating > 0 && (
                      <span className="text-amber-400">★ {listing.seller.sellerRating.toFixed(1)}</span>
                    )}
                    <span>{listing.seller?.sellerSales || 0} vente{(listing.seller?.sellerSales || 0) > 1 ? 's' : ''}</span>
                    <span className="hidden sm:inline">
                      Membre depuis {new Date(listing.seller?.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingDetail;