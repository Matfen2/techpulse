import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts, getBrands } from '../services/productService';
import ProductCard from '../components/ProductCard';

const categories = [
  { name: 'Smartphone', icon: '📱', color: 'var(--primary)' },
  { name: 'Laptop', icon: '💻', color: 'var(--info)' },
  { name: 'Wearable', icon: '⌚', color: 'var(--teal)' },
  { name: 'Accessoire', icon: '🎧', color: 'var(--purple)' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
};

const stagger = {
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
};

const cardVariant = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[var(--primary)] text-xl"
        >
          Chargement...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative bg-[var(--bg-deep)] overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-[var(--info)]/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-medium mb-6 border border-[var(--primary)]/20"
          >
            🔶 Catalogue & Marketplace High-Tech
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight"
          >
            Découvrez les meilleurs
            <br />
            <span className="text-[var(--primary)] inline-block mt-1">produits tech</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[var(--text-secondary)] text-base sm:text-lg max-w-2xl mx-auto mb-8 px-4"
          >
            Le catalogue qui réunit les dernières innovations. Comparez, achetez neuf ou vendez vos appareils d'occasion avec vérification vidéo obligatoire.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
          >
            <Link
              to="/catalogue"
              className="w-full sm:w-auto px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-[var(--primary)]/20 text-center"
            >
              Explorer le catalogue
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] rounded-lg transition-colors text-center"
            >
              Créer un compte
            </Link>
          </motion.div>
        </div>

        {/* Diamond decorations */}
        <motion.div
          initial={{ opacity: 0, rotate: 35 }}
          animate={{ opacity: 1, rotate: 45 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-10 right-10 w-24 lg:w-32 h-24 lg:h-32 border border-[var(--primary)]/20 rotate-45 hidden md:block"
        />
        <motion.div
          initial={{ opacity: 0, rotate: 35 }}
          animate={{ opacity: 1, rotate: 45 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-10 left-10 w-16 lg:w-20 h-16 lg:h-20 border border-[var(--primary)]/10 rotate-45 hidden md:block"
        />
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-[var(--bg-base)] border-y border-[var(--border)]">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 py-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: stats.total, label: 'Produits', color: 'text-[var(--primary)]' },
              { value: stats.brands, label: 'Marques', color: 'text-[var(--primary)]' },
              { value: stats.categories, label: 'Catégories', color: 'text-[var(--primary)]' },
              { value: '🔒', label: 'Vidéo vérifiée', color: 'text-[var(--success)]', isIcon: true },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                  {stat.isIcon ? stat.value : stat.value}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6 sm:mb-8"
        >
          Explorer par catégorie
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={`/catalogue?category=${cat.name}`}
                className="block bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 sm:p-6 text-center hover:border-[var(--primary)] transition-all duration-300 group hover:shadow-lg hover:shadow-[var(--primary)]/5"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-[var(--text-primary)] font-semibold text-sm sm:text-base group-hover:text-[var(--primary)] transition-colors">
                  {cat.name}s
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 hidden sm:block">
                  Voir les produits
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Popular Products ── */}
      <section className="bg-[var(--bg-base)] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-6 sm:mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Produits populaires
            </h2>
            <Link
              to="/catalogue"
              className="text-[var(--primary)] hover:underline text-sm"
            >
              Voir tout →
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {popularProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works (nouveau) ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6 sm:mb-8 text-center"
        >
          Comment ça marche ?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            { step: '1', icon: '📹', title: 'Filmez votre produit', desc: 'Enregistrez une vidéo de votre appareil en fonctionnement pour prouver son état.' },
            { step: '2', icon: '🛡️', title: 'Vérification admin', desc: 'Notre équipe vérifie la vidéo et approuve votre annonce avant publication.' },
            { step: '3', icon: '🤝', title: 'Achat sécurisé', desc: 'Les acheteurs achètent en confiance grâce à la vérification vidéo obligatoire.' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 text-center relative group hover:border-[var(--primary)]/30 transition-all"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {item.step}
              </div>
              <div className="text-3xl sm:text-4xl mb-3 mt-2 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-[var(--text-primary)] font-semibold mb-2">{item.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Brands ── */}
      <section className="bg-[var(--bg-base)] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6 sm:mb-8"
          >
            Nos marques
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  to={`/catalogue?brand=${brand.name}`}
                  className="block bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--primary)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/5"
                >
                  <div className="text-[var(--text-primary)] font-semibold text-sm">
                    {brand.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {brand.count} produit{brand.count > 1 ? 's' : ''}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[var(--primary)]/10 to-orange-600/5 border border-[var(--primary)]/20 rounded-2xl p-8 sm:p-12 text-center"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-3">
            Prêt à vendre vos appareils ?
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Rejoignez la marketplace TechPulse. Filmez votre produit, publiez votre annonce et vendez en toute confiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/marketplace/create"
              className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-[var(--primary)]/20"
            >
              Déposer une annonce
            </Link>
            <Link
              to="/marketplace"
              className="px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] rounded-lg transition-colors"
            >
              Explorer la marketplace
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;