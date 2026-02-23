import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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

  // Update a filter and reset to page 1
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
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const hasActiveFilters = filters.category || filters.brand || filters.search || filters.minPrice || filters.maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Catalogue</h1>
        <p className="text-[var(--text-muted)]">{total} produit{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-8">
        {/* ── Sidebar Filters ── */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-6 sticky top-24">
            {/* Search */}
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Recherche</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Catégorie</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter('category', filters.category === cat ? '' : cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      filters.category === cat
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)]'
                    }`}
                  >
                    {cat}s
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Marque</label>
              <div className="space-y-1">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setFilter('brand', filters.brand === brand ? '' : brand)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      filters.brand === brand
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)]'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Prix (€)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilter('minPrice', e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilter('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm text-[var(--error)] hover:underline cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {filters.category && (
                <span className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs flex items-center gap-1">
                  {filters.category}
                  <button onClick={() => setFilter('category', '')} className="ml-1 cursor-pointer">×</button>
                </span>
              )}
              {filters.brand && (
                <span className="px-3 py-1 bg-[var(--info)]/10 text-[var(--info)] rounded-full text-xs flex items-center gap-1">
                  {filters.brand}
                  <button onClick={() => setFilter('brand', '')} className="ml-1 cursor-pointer">×</button>
                </span>
              )}
            </div>
            <select
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20 text-[var(--text-muted)]">Chargement...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-[var(--text-muted)]">Aucun produit trouvé</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[var(--primary)] hover:underline text-sm cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setFilter('page', String(filters.page - 1))}
                disabled={filters.page <= 1}
                className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--primary)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                ← Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilter('page', String(p))}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    p === filters.page
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setFilter('page', String(filters.page + 1))}
                disabled={filters.page >= totalPages}
                className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--primary)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;