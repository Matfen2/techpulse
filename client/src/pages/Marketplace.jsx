import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getListings } from '../services/productService';

const categories = ['Smartphone', 'Laptop', 'Wearable', 'Accessoire'];
const conditions = ['Comme neuf', 'Très bon état', 'Bon état', 'État correct'];

const CATEGORY_ICONS = {
  Smartphone: '📱',
  Laptop: '💻',
  Wearable: '⌚',
  Accessoire: '🎧',
};

const conditionColors = {
  'Comme neuf': { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'Très bon état': { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  'Bon état': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'État correct': { color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' },
};

// ── Skeleton loader ──
const ListingSkeleton = () => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse">
    <div className="h-40 sm:h-48 bg-[var(--bg-base)]" />
    <div className="p-3 sm:p-4 space-y-3">
      <div className="flex gap-2">
        <div className="h-4 w-16 bg-[var(--bg-base)] rounded" />
        <div className="h-4 w-14 bg-[var(--bg-base)] rounded" />
      </div>
      <div className="h-4 w-3/4 bg-[var(--bg-base)] rounded" />
      <div className="flex justify-between">
        <div className="h-5 w-16 bg-[var(--bg-base)] rounded" />
        <div className="h-4 w-20 bg-[var(--bg-base)] rounded" />
      </div>
    </div>
  </div>
);

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  const filters = {
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
    search: searchParams.get('search') || '',
  };

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setMobileFilters(false);
  };

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = { limit: 12 };
        if (filters.category) params.category = filters.category;
        if (filters.condition) params.condition = filters.condition;
        if (filters.sort) params.sort = filters.sort;
        if (filters.page) params.page = filters.page;
        if (filters.search) params.search = filters.search;

        const { data } = await getListings(params);
        setListings(data.listings);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [searchParams]);

  const hasActiveFilters = filters.category || filters.condition || filters.search;
  const activeFilterCount = [filters.category, filters.condition, filters.search].filter(Boolean).length;

  return (
    <div className="max-w-9xl mx-auto px-4 py-6 sm:py-8">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-1">Marketplace</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {total} annonce{total > 1 ? 's' : ''} d'occasion — vérification vidéo obligatoire 🔒
          </p>
        </div>
        <Link
          to="/marketplace/new"
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[var(--orange)] hover:opacity-90 text-white font-semibold rounded-lg transition-opacity text-sm sm:text-base text-center"
        >
          + Publier une annonce
        </Link>
      </motion.div>

      {/* ── Desktop Filters bar ── */}
      <div className="hidden sm:block mb-6">
        {/* Search row */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 mb-3">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">🔍</span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Rechercher une annonce..."
              className="w-full pl-11 pr-4 py-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
            />
          </div>
        </div>

        {/* Filter pills row */}
        <div className="flex items-center gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter('category', filters.category === cat ? '' : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  filters.category === cat
                    ? 'bg-[var(--orange)] text-white shadow-md shadow-[var(--orange)]/25'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-deep)]'
                }`}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                {cat}
              </button>
            ))}
          </div>

          {/* Conditions */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1.5">
            {conditions.map((cond) => (
              <button
                key={cond}
                onClick={() => setFilter('condition', filters.condition === cond ? '' : cond)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  filters.condition === cond
                    ? 'shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-deep)]'
                }`}
                style={filters.condition === cond ? {
                  backgroundColor: conditionColors[cond]?.bg,
                  color: conditionColors[cond]?.color,
                  boxShadow: `0 4px 12px ${conditionColors[cond]?.bg}`,
                } : {}}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: conditionColors[cond]?.color }} />
                {cond}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1.5">
            {[
              { value: 'newest', label: 'Récentes' },
              { value: 'price_asc', label: 'Prix ↑' },
              { value: 'price_desc', label: 'Prix ↓' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter('sort', opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.sort === opt.value
                    ? 'bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-deep)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Clear */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearFilters}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Réinitialiser"
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile: Filter button + Sort ── */}
      <div className="flex items-center gap-3 mb-4 sm:hidden">
        <button
          onClick={() => setMobileFilters(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] hover:border-[var(--orange)] transition-colors relative"
        >
          <span>🎛️</span>
          Filtres
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--orange)] text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <select
          value={filters.sort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="flex-1 px-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] cursor-pointer"
        >
          <option value="newest">Plus récentes</option>
          <option value="price_asc">Prix ↑</option>
          <option value="price_desc">Prix ↓</option>
        </select>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilters(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-[var(--bg-card)] border-r border-[var(--border)] overflow-y-auto sm:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2 className="font-bold text-[var(--text)]">Filtres</h2>
                <button
                  onClick={() => setMobileFilters(false)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-deep)] text-[var(--text-muted)] transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Recherche</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilter('search', e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-colors"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Catégorie</label>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter('category', filters.category === cat ? '' : cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer flex items-center gap-2 ${
                          filters.category === cat
                            ? 'bg-[var(--orange)]/10 text-[var(--orange)] font-medium'
                            : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-deep)]'
                        }`}
                      >
                        <span>{CATEGORY_ICONS[cat]}</span>
                        {cat}
                        {filters.category === cat && <span className="ml-auto text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditions */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">État</label>
                  <div className="space-y-1">
                    {conditions.map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setFilter('condition', filters.condition === cond ? '' : cond)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer flex items-center gap-2 ${
                          filters.condition === cond
                            ? 'font-medium'
                            : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-deep)]'
                        }`}
                        style={filters.condition === cond ? {
                          backgroundColor: conditionColors[cond]?.bg,
                          color: conditionColors[cond]?.color,
                        } : {}}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: conditionColors[cond]?.color }} />
                        {cond}
                        {filters.condition === cond && <span className="ml-auto text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    ✕ Réinitialiser les filtres
                  </button>
                )}
              </div>

              <div className="p-4 border-t border-[var(--border)]">
                <button
                  onClick={() => setMobileFilters(false)}
                  className="w-full py-3 bg-[var(--orange)] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Voir les {total} résultats
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Listings Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 sm:py-20"
        >
          <div className="text-5xl mb-4">🏪</div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text)] mb-2">Aucune annonce pour le moment</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">Soyez le premier à publier une annonce !</p>
          <Link
            to="/marketplace/new"
            className="inline-block px-6 py-3 bg-[var(--orange)] hover:opacity-90 text-white font-semibold rounded-lg transition-opacity"
          >
            Publier une annonce
          </Link>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {listings.map((listing, i) => (
              <motion.div
                key={listing._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Link
                  to={`/marketplace/${listing.slug}`}
                  className="block bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--orange)]/50 transition-all duration-300 group hover:shadow-lg hover:shadow-[var(--orange)]/5"
                >
                  {/* Image */}
                  <div className="h-36 sm:h-48 bg-[var(--bg-base)] flex items-center justify-center overflow-hidden relative">
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-3xl sm:text-4xl opacity-80">{CATEGORY_ICONS[listing.category] || '📦'}</div>
                    )}

                    {/* Video badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/70 backdrop-blur-sm rounded text-[10px] sm:text-xs text-white flex items-center gap-1">
                      🎥 <span className="hidden sm:inline">Vidéo</span>
                    </div>

                    {/* Condition badge */}
                    <span
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium backdrop-blur-sm"
                      style={{
                        backgroundColor: conditionColors[listing.condition]?.bg,
                        color: conditionColors[listing.condition]?.color,
                      }}
                    >
                      <span className="hidden sm:inline">{listing.condition}</span>
                      <span className="sm:hidden">
                        {listing.condition === 'Comme neuf' ? 'Neuf' :
                         listing.condition === 'Très bon état' ? 'TB' :
                         listing.condition === 'Bon état' ? 'Bon' : 'OK'}
                      </span>
                    </span>

                    {/* Hover gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <span className="px-1.5 sm:px-2 py-0.5 bg-[var(--orange)]/10 text-[var(--orange)] rounded text-[10px] sm:text-xs">
                        {CATEGORY_ICONS[listing.category]} <span className="hidden sm:inline">{listing.category}</span>
                      </span>
                      {listing.videoVerified && (
                        <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] sm:text-xs">
                          ✓ <span className="hidden sm:inline">Vérifié</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-[var(--text)] font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-[var(--orange)] transition-colors duration-200 leading-snug">
                      {listing.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-[var(--orange)] font-bold text-sm sm:text-lg font-mono">
                        {listing.price.toLocaleString('fr-FR')}€
                      </span>
                      <span className="text-[10px] sm:text-xs text-[var(--text-muted)] truncate ml-2">
                        {listing.seller?.firstName} {listing.seller?.lastName?.[0]}.
                      </span>
                    </div>

                    {listing.location && (
                      <p className="text-[10px] sm:text-xs text-[var(--text-muted)]/70 mt-1.5 sm:mt-2 truncate">
                        📍 {listing.location}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 sm:mt-10"
        >
          <button
            onClick={() => setFilter('page', String(filters.page - 1))}
            disabled={filters.page <= 1}
            className="px-3 sm:px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-xs sm:text-sm text-[var(--text-muted)] hover:border-[var(--orange)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 5) return true;
              if (p === 1 || p === totalPages) return true;
              return Math.abs(p - filters.page) <= 1;
            })
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`dots-${i}`} className="px-1 text-[var(--text-muted)] text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setFilter('page', String(p))}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    p === filters.page
                      ? 'bg-[var(--orange)] text-white shadow-lg shadow-[var(--orange)]/25'
                      : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--orange)]'
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setFilter('page', String(filters.page + 1))}
            disabled={filters.page >= totalPages}
            className="px-3 sm:px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-xs sm:text-sm text-[var(--text-muted)] hover:border-[var(--orange)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Marketplace;