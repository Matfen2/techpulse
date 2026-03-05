import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { getMyReviews, getMyListings, deleteReview, getFavorites } from '../services/productService';

const CATEGORY_ICONS = {
  Smartphone: '📱',
  Laptop: '💻',
  Wearable: '⌚',
  Accessoire: '🎧',
};

const STATUS_CONFIG = {
  active: { label: 'Active', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  pending: { label: 'En attente', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  rejected: { label: 'Rejetée', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  sold: { label: 'Vendue', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
};

// ── Skeleton ──
const CardSkeleton = () => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse">
    <div className="h-32 sm:h-40 bg-[var(--bg-base)]" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/4 bg-[var(--bg-base)] rounded" />
      <div className="h-3 w-1/2 bg-[var(--bg-base)] rounded" />
      <div className="flex justify-between pt-2">
        <div className="h-4 w-14 bg-[var(--bg-base)] rounded" />
        <div className="h-3 w-10 bg-[var(--bg-base)] rounded" />
      </div>
    </div>
  </div>
);

const RowSkeleton = () => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--bg-base)] rounded-lg shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-2/3 bg-[var(--bg-base)] rounded" />
      <div className="h-3 w-1/3 bg-[var(--bg-base)] rounded" />
    </div>
    <div className="h-5 w-14 bg-[var(--bg-base)] rounded shrink-0" />
  </div>
);

// ── Empty state ──
const EmptyState = ({ icon, text, linkTo, linkText }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-10 sm:p-12 text-center"
  >
    <div className="text-4xl sm:text-5xl mb-4">{icon}</div>
    <p className="text-[var(--text-muted)] mb-4 text-sm font-qaranta">{text}</p>
    <Link
      to={linkTo}
      className="inline-block px-5 py-2.5 bg-[var(--orange)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity font-qaranta"
    >
      {linkText}
    </Link>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [favorites, setFavorites] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get('tab') || 'favorites';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'favorites') {
          const res = await getFavorites();
          setFavorites(res.data);
        } else if (activeTab === 'reviews') {
          const res = await getMyReviews();
          setReviews(res.data);
        } else if (activeTab === 'listings') {
          const res = await getMyListings();
          setListings(res.data);
        }
      } catch {
        // silent
      }
      setLoading(false);
    };
    fetchData();
  }, [activeTab]);

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Supprimer cet avis ?')) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      // silent
    }
  };

  const tabs = [
    { key: 'favorites', label: 'Favoris', icon: '❤️', mobileLabel: '❤️', count: favoriteIds.length },
    { key: 'reviews', label: 'Mes Avis', icon: '⭐', mobileLabel: '⭐', count: reviews.length },
    { key: 'listings', label: 'Annonces', icon: '🏷️', mobileLabel: '🏷️', count: listings.length },
    { key: 'settings', label: 'Paramètres', icon: '⚙️', mobileLabel: '⚙️' },
  ];

  const setTab = (key) => setSearchParams({ tab: key });

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* ══════════════════════════════════════════ */}
          {/* ── Sidebar (desktop) ── */}
          {/* ══════════════════════════════════════════ */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 sticky top-24"
            >
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--orange)] to-amber-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg shadow-[var(--orange)]/20">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <h3 className="text-[var(--text)] font-bold text-lg font-request">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-[var(--text-muted)] text-sm font-qaranta">{user?.email}</p>
                <p className="text-[var(--text-muted)] text-xs mt-1 font-qaranta">
                  Membre depuis {new Date(user?.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { value: favoriteIds.length, label: 'Favoris' },
                  { value: reviews.length, label: 'Avis' },
                  { value: listings.length, label: 'Annonces' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-2 bg-[var(--bg-deep)] rounded-xl">
                    <p className="text-base font-bold text-[var(--orange)] font-request">{s.value}</p>
                    <p className="text-[10px] text-[var(--text-muted)] font-qaranta">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setTab(tab.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer font-qaranta ${
                      activeTab === tab.key
                        ? 'bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/30'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-deep)] hover:text-[var(--text)]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{tab.icon}</span>
                      {tab.label}
                    </span>
                    {tab.count !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        activeTab === tab.key ? 'bg-[var(--orange)]/20 text-[var(--orange)]' : 'bg-[var(--bg-base)] text-[var(--text-muted)]'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </motion.div>
          </aside>

          {/* ══════════════════════════════════════════ */}
          {/* ── Mobile header + tabs ── */}
          {/* ══════════════════════════════════════════ */}
          <div className="lg:hidden">
            {/* Mobile profile header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--orange)] to-amber-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg shadow-[var(--orange)]/20">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="min-w-0">
                <h3 className="text-[var(--text)] font-bold text-base truncate font-request">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-[var(--text-muted)] text-xs truncate font-qaranta">{user?.email}</p>
              </div>
            </motion.div>

            {/* Mobile tab bar */}
            <div className="flex gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1.5 mb-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTab(tab.key)}
                  className={`flex-1 min-w-0 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 font-qaranta ${
                    activeTab === tab.key
                      ? 'bg-[var(--orange)] text-white shadow-md shadow-[var(--orange)]/25'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <span>{tab.mobileLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[var(--bg-base)] text-[var(--text-muted)]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════ */}
          {/* ── Main Content ── */}
          {/* ══════════════════════════════════════════ */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* ── Favoris ── */}
              {activeTab === 'favorites' && (
                <motion.div
                  key="favorites"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] font-request">❤️ Mes Favoris</h1>
                      <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-1 font-qaranta">{favorites.length} produit{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                  ) : favorites.length === 0 ? (
                    <EmptyState icon="❤️" text="Aucun favori pour le moment" linkTo="/catalogue" linkText="Explorer le catalogue" />
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {favorites.map((product, i) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--orange)]/50 transition-all group"
                        >
                          <div className="relative">
                            <Link to={`/catalogue/${product.slug}`}>
                              <div className="h-28 sm:h-40 bg-[var(--bg-base)] flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                  <span className="text-3xl sm:text-5xl opacity-80">
                                    {CATEGORY_ICONS[product.category] || '📦'}
                                  </span>
                                )}
                              </div>
                            </Link>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => {
                                toggleFavorite(product._id);
                                setFavorites((prev) => prev.filter((p) => p._id !== product._id));
                              }}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-colors cursor-pointer text-sm"
                            >
                              ♥
                            </motion.button>
                          </div>
                          <div className="p-3 sm:p-4">
                            <Link to={`/catalogue/${product.slug}`}>
                              <h3 className="text-[var(--text)] font-semibold text-xs sm:text-sm group-hover:text-[var(--orange)] transition-colors line-clamp-2 leading-snug font-request">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-[var(--text-muted)] text-[10px] sm:text-xs mt-1 font-qaranta">{product.brand}</p>
                            <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 border-t border-[var(--border)]/50">
                              <span className="text-[var(--orange)] font-bold text-sm sm:text-base font-mono">{product.price}€</span>
                              {product.rating > 0 && (
                                <span className="text-amber-400 text-[10px] sm:text-xs">★ {product.rating.toFixed(1)}</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Mes Avis ── */}
              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] font-request">⭐ Mes Avis</h1>
                      <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-1 font-qaranta">{reviews.length} avis publié{reviews.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)}
                    </div>
                  ) : reviews.length === 0 ? (
                    <EmptyState icon="⭐" text="Aucun avis publié" linkTo="/catalogue" linkText="Donner mon premier avis" />
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {reviews.map((review, i) => (
                        <motion.div
                          key={review._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 sm:p-5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 bg-[var(--bg-deep)] rounded-xl flex items-center justify-center text-lg shrink-0">
                                {CATEGORY_ICONS[review.product?.category] || '📦'}
                              </div>
                              <div className="min-w-0">
                                <Link to={`/catalogue/${review.product?.slug}`} className="text-[var(--text)] font-semibold text-sm hover:text-[var(--orange)] transition-colors truncate block font-request">
                                  {review.product?.name}
                                </Link>
                                <p className="text-[var(--text-muted)] text-[10px] sm:text-xs font-qaranta">{review.product?.brand} • {review.product?.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              {[...Array(5)].map((_, j) => (
                                <span key={j} className={`text-xs ${j < review.rating ? 'text-amber-400' : 'text-[var(--border)]'}`}>★</span>
                              ))}
                            </div>
                          </div>

                          <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-3 leading-relaxed font-qaranta">{review.comment}</p>

                          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-[var(--border)]/50">
                            <span className="text-[var(--text-muted)] text-[10px] sm:text-xs font-qaranta">
                              {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <div className="flex gap-1.5 sm:gap-2">
                              <Link to={`/catalogue/${review.product?.slug}`} className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs border border-[var(--border)] text-[var(--text-muted)] rounded-lg font-qaranta hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors">
                                ✏️ <span className="hidden sm:inline">Modifier</span>
                              </Link>
                              <button onClick={() => handleDeleteReview(review._id)} className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs border border-red-500/30 text-red-400 rounded-lg font-qaranta hover:bg-red-500/10 transition-colors cursor-pointer">
                                🗑️ <span className="hidden sm:inline">Supprimer</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Mes Annonces ── */}
              {activeTab === 'listings' && (
                <motion.div
                  key="listings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] font-request">🏷️ Mes Annonces</h1>
                      <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-1 font-qaranta">{listings.length} annonce{listings.length > 1 ? 's' : ''}</p>
                    </div>
                    <Link to="/marketplace/new" className="px-3 sm:px-4 py-2 bg-[var(--orange)] text-white rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium font-qaranta">
                      + <span className="hidden sm:inline">Nouvelle annonce</span><span className="sm:hidden">Créer</span>
                    </Link>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)}
                    </div>
                  ) : listings.length === 0 ? (
                    <EmptyState icon="🏷️" text="Aucune annonce publiée" linkTo="/marketplace/new" linkText="Créer ma première annonce" />
                  ) : (
                    <div className="space-y-3">
                      {listings.map((listing, i) => {
                        const statusCfg = STATUS_CONFIG[listing.status] || {};
                        return (
                          <motion.div
                            key={listing._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-[var(--orange)]/30 transition-colors"
                          >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--bg-deep)] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                              {listing.images?.[0] ? (
                                <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg sm:text-2xl">{CATEGORY_ICONS[listing.category] || '📦'}</span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                                <Link to={`/marketplace/${listing.slug}`} className="text-[var(--text)] font-semibold text-xs sm:text-sm hover:text-[var(--orange)] transition-colors truncate font-request">
                                  {listing.title}
                                </Link>
                                <span
                                  className="px-2 py-0.5 text-[10px] sm:text-xs rounded-full shrink-0 font-medium"
                                  style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                                >
                                  {statusCfg.label}
                                </span>
                              </div>
                              <p className="text-[var(--text-muted)] text-[10px] sm:text-xs truncate font-qaranta">
                                {listing.category} • {listing.condition} • {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[var(--orange)] font-bold text-sm sm:text-base font-mono">{listing.price}€</span>
                              {listing.videoVerified && (
                                <p className="text-emerald-400 text-[10px] sm:text-xs mt-0.5">✓ Vérifiée</p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Paramètres ── */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-5 sm:mb-6">⚙️ Paramètres</h1>
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 sm:p-6">
                    <h3 className="text-[var(--text)] font-bold text-sm sm:text-base mb-4 font-request">Informations personnelles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider mb-2 font-qaranta">Prénom</label>
                        <input
                          type="text"
                          defaultValue={user?.firstName}
                          className="w-full px-4 py-2.5 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-[var(--text)] text-sm font-qaranta focus:border-[var(--orange)] focus:outline-none transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
                        />
                      </div>
                      <div>
                        <label className="block text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider mb-2 font-qaranta">Nom</label>
                        <input
                          type="text"
                          defaultValue={user?.lastName}
                          className="w-full px-4 py-2.5 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-[var(--text)] text-sm font-qaranta focus:border-[var(--orange)] focus:outline-none transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider mb-2 font-qaranta">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-2.5 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-[var(--text)] text-sm font-qaranta focus:border-[var(--orange)] focus:outline-none transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
                      />
                    </div>
                    <div className="mt-6 pt-4 border-t border-[var(--border)]">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="px-6 py-2.5 bg-[var(--orange)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Sauvegarder
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;