import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getBrands } from '../services/productService';
import ProductCard from '../components/ProductCard';

const categories = [
  { name: 'Smartphone', icon: '📱', color: 'var(--primary)' },
  { name: 'Laptop', icon: '💻', color: 'var(--info)' },
  { name: 'Wearable', icon: '⌚', color: 'var(--teal)' },
  { name: 'Accessoire', icon: '🎧', color: 'var(--purple)' },
];

const Home = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [stats, setStats] = useState({ total: 0, brands: 0, categories: 4 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, brandsRes] = await Promise.all([
          getProducts({ sort: 'rating', limit: 8 }),
          getBrands(),
        ]);
        setPopularProducts(productsRes.data.products);
        setBrands(brandsRes.data);
        setStats({
          total: productsRes.data.total,
          brands: brandsRes.data.length,
          categories: 4,
        });
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--primary)] text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-[var(--bg-deep)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <span className="inline-block px-4 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-medium mb-6">
            🔶 Catalogue & Marketplace High-Tech
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
            Découvrez les meilleurs
            <br />
            <span className="text-[var(--primary)]">produits tech</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto mb-8">
            Le catalogue qui réunit les dernières innovations. Comparez, achetez neuf ou vendez vos appareils d'occasion avec vérification vidéo obligatoire.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/catalogue"
              className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors"
            >
              Explorer le catalogue
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] rounded-lg transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Diamond decoration */}
        <div className="absolute top-10 right-10 w-32 h-32 border border-[var(--primary)]/20 rotate-45 hidden lg:block" />
        <div className="absolute bottom-10 left-10 w-20 h-20 border border-[var(--primary)]/10 rotate-45 hidden lg:block" />
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-[var(--bg-base)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--primary)]">{stats.total}</div>
            <div className="text-xs text-[var(--text-muted)]">Produits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--primary)]">{stats.brands}</div>
            <div className="text-xs text-[var(--text-muted)]">Marques</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--primary)]">{stats.categories}</div>
            <div className="text-xs text-[var(--text-muted)]">Catégories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--success)]">🔒</div>
            <div className="text-xs text-[var(--text-muted)]">Vidéo vérifiée</div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
          Explorer par catégorie
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/catalogue?category=${cat.name}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--primary)] transition-all duration-300 group"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-[var(--text-primary)] font-semibold group-hover:text-[var(--primary)] transition-colors">
                {cat.name}s
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {brands.length > 0 && 'Voir les produits'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Popular Products ── */}
      <section className="bg-[var(--bg-base)] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Produits populaires
            </h2>
            <Link
              to="/catalogue"
              className="text-[var(--primary)] hover:underline text-sm"
            >
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Brands ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
          Nos marques
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={`/catalogue?brand=${brand.name}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--primary)] transition-all duration-300"
            >
              <div className="text-[var(--text-primary)] font-semibold text-sm">
                {brand.name}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                {brand.count} produit{brand.count > 1 ? 's' : ''}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;