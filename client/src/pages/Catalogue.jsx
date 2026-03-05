import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

const categories = ['Smartphone', 'Laptop', 'Wearable', 'Accessoire'];
const brands = ['Samsung', 'Apple', 'Xiaomi', 'Asus', 'Sony', 'Lenovo'];
const sortOptions = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'name', label: 'Nom A-Z' },
];

const CATEGORY_ICONS = {
  Smartphone: '📱',
  Laptop: '💻',
  Wearable: '⌚',
  Accessoire: '🎧',
};

// ── Skeleton loader ──
const ProductSkeleton = () => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse">
    <div className="h-40 sm:h-48 bg-[var(--bg-base)]" />
    <div className="p-4 space-y-3">
      <div className="flex gap-2">
        <div className="h-4 w-16 bg-[var(--bg-base)] rounded" />
        <div className="h-4 w-12 bg-[var(--bg-base)] rounded" />
      </div>
      <div className="h-4 w-3/4 bg-[var(--bg-base)] rounded" />
      <div className="h-3 w-1/2 bg-[var(--bg-base)] rounded" />
      <div className="flex justify-between pt-2 border-t border-[var(--border)]/50">
        <div className="h-5 w-16 bg-[var(--bg-base)] rounded" />
        <div className="h-4 w-14 bg-[var(--bg-base)] rounded-full" />
      </div>
    </div>
  </div>
);

// ── Filter sidebar content (shared desktop + mobile) ──
const FilterContent = ({ filters, setFilter, clearFilters, hasActiveFilters }) => (
  <div className="space-y-6">
    {/* Search */}
    <div>
      <label className="block text-xs font-request text-[var(--text-muted)] uppercase tracking-wider mb-2">
        Recherche
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Rechercher..."
          className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-deep)] font-qaranta border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-colors"
        />
      </div>
    </div>

    {/* Categories */}
    <div>
      <label className="block text-xs font-request text-[var(--text-muted)] uppercase tracking-wider mb-2">
        Catégorie
      </label>
      <div className="space-y-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter('category', filters.category === cat ? '' : cat)}
            className={`w-full text-left px-3 py-2 rounded-lg text-md font-qaranta transition-all cursor-pointer flex items-center gap-2 ${
              filters.category === cat
                ? 'bg-[var(--orange)]/10 text-[var(--orange)] font-medium'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-deep)]'
            }`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            {cat}s
            {filters.category === cat && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto text-xs"
              >
                ✓
              </motion.span>
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Brands */}
    <div>
      <label className="block text-xs font-request text-[var(--text-muted)] uppercase tracking-wider mb-2">
        Marque
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => setFilter('brand', filters.brand === brand ? '' : brand)}
            className={`px-3 py-2 rounded-lg text-sm font-qaranta transition-all cursor-pointer text-center ${
              filters.brand === brand
                ? 'bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/30 font-medium'
                : 'bg-[var(--bg-deep)] text-[var(--text-muted)] border border-transparent hover:text-[var(--text)] hover:border-[var(--border)]'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <label className="block text-xs font-request text-[var(--text-muted)] uppercase tracking-wider mb-2">
        Prix (€)
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => setFilter('minPrice', e.target.value)}
          placeholder="Min"
          className="w-full px-3 py-2.5 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-sm font-qaranta text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] font-mono transition-colors"
        />
        <span className="text-[var(--text-muted)] self-center text-sm">—</span>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => setFilter('maxPrice', e.target.value)}
          placeholder="Max"
          className="w-full px-3 py-2.5 bg-[var(--bg-deep)] border border-[var(--border)] rounded-lg text-sm font-qaranta text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] font-mono transition-colors"
        />
      </div>
    </div>

    {/* Clear */}
    {hasActiveFilters && (
      <motion.button
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={clearFilters}
        className="w-full py-2.5 text-md font-qaranta text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
      >
        ✕ Réinitialiser les filtres
      </motion.button>
    )}
  </div>
);

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  // Read filters from URL
  const filters = {
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.brand) params.brand = filters.brand;
        if (filters.sort) params.sort = filters.sort;
        if (filters.page) params.page = filters.page;
        if (filters.search) params.search = filters.search;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        params.limit = 12;

        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const hasActiveFilters = filters.category || filters.brand || filters.search || filters.minPrice || filters.maxPrice;
  const activeFilterCount = [filters.category, filters.brand, filters.search, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  return (
    <div className="max-w-8xl mx-auto px-4 py-6 sm:py-8">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-request text-[var(--text)] mb-1">Catalogue</h1>
        <p className="text-md font-qaranta text-[var(--text-muted)]">
          {total} produit{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* ── Mobile: Filter button + Sort ── */}
      <div className="flex items-center gap-3 mb-4 md:hidden">
        <button
          onClick={() => setMobileFilters(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] hover:border-[var(--orange)] transition-colors relative"
        >
          <span>🎛️</span>
          Filtres
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--orange)] text-white font-qaranta text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <select
          value={filters.sort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="flex-1 px-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm font-qaranta text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-[var(--bg-card)] border-r border-[var(--border)] overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2 className="font-qaranta text-[var(--text)]">Filtres</h2>
                <button
                  onClick={() => setMobileFilters(false)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-deep)] font-qaranta text-[var(--text-muted)] transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <FilterContent
                  filters={filters}
                  setFilter={(key, value) => { setFilter(key, value); }}
                  clearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
              {/* Apply button mobile */}
              <div className="p-4 border-t border-[var(--border)]">
                <button
                  onClick={() => setMobileFilters(false)}
                  className="w-full py-3 bg-[var(--orange)] text-white rounded-lg font-qaranta text-sm hover:opacity-90 transition-opacity"
                >
                  Voir les {total} résultats
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex gap-8">

        {/* ── Desktop Sidebar ── */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 sticky top-24">
            <FilterContent
              filters={filters}
              setFilter={setFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">

          {/* Desktop Sort Bar */}
          <div className="hidden md:flex items-center -mt-20 justify-between mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <AnimatePresence>
                {filters.category && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-3 py-1 bg-[var(--orange)]/10 text-[var(--orange)] rounded-full text-md font-qaranta flex items-center gap-1.5"
                  >
                    {CATEGORY_ICONS[filters.category]} {filters.category}
                    <button onClick={() => setFilter('category', '')} className="ml-0.5 hover:text-white cursor-pointer">×</button>
                  </motion.span>
                )}
                {filters.brand && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-3 py-1 bg-sky-500/10 text-sky-400 rounded-full text-md font-qaranta flex items-center gap-1"
                  >
                    {filters.brand}
                    <button onClick={() => setFilter('brand', '')} className="ml-0.5 hover:text-white cursor-pointer">×</button>
                  </motion.span>
                )}
                {filters.search && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-md font-qaranta flex items-center gap-1"
                  >
                    « {filters.search} »
                    <button onClick={() => setFilter('search', '')} className="ml-0.5 hover:text-white cursor-pointer">×</button>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <select
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm font-qaranta text-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* ── Products Grid ── */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-[var(--text-muted)] text-2xl font-request mb-1">Aucun produit trouvé</p>
              <p className="text-xl text-[var(--text-muted)]/50 mb-1 font-qaranta">Essayez avec d'autres filtres</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-[var(--orange)] hover:bg-[var(--orange)]/10 rounded-lg text-lg font-qaranta cursor-pointer transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <ProductCard product={product} />
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
                className="px-3 sm:px-2 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-xs sm:text-md text-[var(--text-muted)] hover:border-[var(--orange)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                ←
              </button>

              {/* Smart pagination: show limited pages on mobile */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 5) return true;
                  if (p === 1 || p === totalPages) return true;
                  return Math.abs(p - filters.page) <= 1;
                })
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) {
                    acc.push('...');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-1 text-[var(--text-muted)] font-request text-md">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setFilter('page', String(p))}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-request transition-all cursor-pointer ${
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
                className="px-3 sm:px-2 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-xs sm:text-sm text-[var(--text-muted)] hover:border-[var(--orange)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                →
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;