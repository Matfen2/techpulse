 import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getListings } from '../services/productService';

const categories = ['Smartphone', 'Laptop', 'Wearable', 'Accessoire'];
const conditions = ['Comme neuf', 'Très bon état', 'Bon état', 'État correct'];

const conditionColors = {
  'Comme neuf': 'var(--success)',
  'Très bon état': 'var(--info)',
  'Bon état': 'var(--warning)',
  'État correct': 'var(--text-muted)',
};

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Marketplace</h1>
          <p className="text-[var(--text-muted)]">
            {total} annonce{total > 1 ? 's' : ''} d'occasion — vérification vidéo obligatoire 🔒
          </p>
        </div>
        <Link
          to="/marketplace/new"
          className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors"
        >
          + Publier une annonce
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Rechercher..."
            className="px-4 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] w-64"
          />

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
            className="px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
          >
            <option value="">Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Condition */}
          <select
            value={filters.condition}
            onChange={(e) => setFilter('condition', e.target.value)}
            className="px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
          >
            <option value="">Tout état</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
          >
            <option value="newest">Plus récentes</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-20 text-[var(--text-muted)]">Chargement...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Aucune annonce pour le moment</h2>
          <p className="text-[var(--text-muted)] mb-6">Soyez le premier à publier une annonce !</p>
          <Link
            to="/marketplace/new"
            className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors"
          >
            Publier une annonce
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/marketplace/${listing.slug}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--primary)] transition-all duration-300 group"
            >
              {/* Image / Video thumbnail */}
              <div className="h-48 bg-[var(--bg-base)] flex items-center justify-center overflow-hidden relative">
                {listing.images?.[0] ? (
                  <img
                    src={listing.images[0].url}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-4xl">📦</div>
                )}
                {/* Video badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 rounded text-xs text-white flex items-center gap-1">
                  🎥 Vidéo
                </div>
                {/* Condition badge */}
                <span
                  className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${conditionColors[listing.condition]}20`,
                    color: conditionColors[listing.condition],
                  }}
                >
                  {listing.condition}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-xs">
                    {listing.category}
                  </span>
                  {listing.videoVerified && (
                    <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] rounded text-xs">
                      ✓ Vérifié
                    </span>
                  )}
                </div>

                <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                  {listing.title}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--primary)] font-bold text-lg">
                    {listing.price.toLocaleString('fr-FR')} €
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {listing.seller?.firstName} {listing.seller?.lastName?.[0]}.
                  </span>
                </div>

                {listing.location && (
                  <p className="text-xs text-[var(--text-muted)] mt-2">📍 {listing.location}</p>
                )}
              </div>
            </Link>
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
  );
};

export default Marketplace;