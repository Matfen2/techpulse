import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getListingBySlug } from '../services/productService';

const conditionColors = {
  'Comme neuf': 'var(--success)',
  'Très bon état': 'var(--info)',
  'Bon état': 'var(--warning)',
  'État correct': 'var(--text-muted)',
};

const ListingDetail = () => {
  const { slug } = useParams();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--primary)] text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-4xl mb-4">😕</div>
        <p className="text-[var(--text-muted)] mb-4">{error || 'Annonce non trouvée'}</p>
        <Link to="/marketplace" className="text-[var(--primary)] hover:underline">← Retour à la marketplace</Link>
      </div>
    );
  }

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
          <Link to="/marketplace" className="hover:text-[var(--primary)] transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]">{listing.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Media */}
          <div className="space-y-4">
            {/* Main media */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden h-96">
              {listing.images?.[activeImage] ? (
                <img
                  src={listing.images[activeImage].url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
              )}
            </div>

            {/* Thumbnails */}
            {listing.images?.length > 1 && (
              <div className="flex gap-3">
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                      i === activeImage ? 'border-[var(--primary)]' : 'border-[var(--border)]'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">🎥 Vidéo de vérification</span>
                {listing.videoVerified && (
                  <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] rounded text-xs">✓ Vérifiée</span>
                )}
              </div>
              <video
                src={listing.video?.url}
                controls
                className="w-full max-h-80"
                poster=""
              />
            </div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-medium">
                {listing.category}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${conditionColors[listing.condition]}20`,
                  color: conditionColors[listing.condition],
                }}
              >
                {listing.condition}
              </span>
              {listing.videoVerified && (
                <span className="px-3 py-1 bg-[var(--success)]/10 text-[var(--success)] rounded-full text-xs font-medium">
                  ✓ Vidéo vérifiée
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  listing.status === 'active'
                    ? 'bg-[var(--success)]/10 text-[var(--success)]'
                    : listing.status === 'pending'
                    ? 'bg-[var(--warning)]/10 text-[var(--warning)]'
                    : 'bg-[var(--error)]/10 text-[var(--error)]'
                }`}
              >
                {listing.status === 'active' ? 'Active' : listing.status === 'pending' ? 'En attente' : listing.status === 'sold' ? 'Vendu' : 'Rejetée'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{listing.title}</h1>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-[var(--primary)]">
                {listing.price.toLocaleString('fr-FR')} €
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Description</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">{listing.description}</p>
            </div>

            {/* Location */}
            {listing.location && (
              <div className="mb-6">
                <span className="text-[var(--text-muted)] text-sm">📍 {listing.location}</span>
              </div>
            )}

            {/* Contact button */}
            <button className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors cursor-pointer mb-8">
              Contacter le vendeur
            </button>

            {/* Seller card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">Vendeur</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                  {listing.seller?.firstName?.[0]}{listing.seller?.lastName?.[0]}
                </div>
                <div>
                  <p className="text-[var(--text-primary)] font-semibold">
                    {listing.seller?.firstName} {listing.seller?.lastName}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    {listing.seller?.sellerRating > 0 && (
                      <span>★ {listing.seller.sellerRating.toFixed(1)}</span>
                    )}
                    <span>{listing.seller?.sellerSales || 0} vente{listing.seller?.sellerSales > 1 ? 's' : ''}</span>
                    <span>Membre depuis {new Date(listing.seller?.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
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