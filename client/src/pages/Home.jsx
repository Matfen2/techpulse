import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts, getBrands } from '../services/productService';
import ProductCard from '../components/ProductCard';

/* ── Constants ── */
const categories = [
  { name: 'Smartphone', icon: '📱', color: 'var(--primary)' },
  { name: 'Laptop', icon: '💻', color: 'var(--info)' },
  { name: 'Wearable', icon: '⌚', color: 'var(--teal)' },
  { name: 'Accessoire', icon: '🎧', color: 'var(--purple)' },
];

const brandLogos = {
  Samsung: '/images/samsung-logo.png',
  Apple: '/images/apple-logo.jpg',
  Xiaomi: '/images/xiaomi-logo.png',
  Asus: '/images/asus-logo.jpg',
  Sony: '/images/sony-logo.png',
  Lenovo: '/images/lenovo-logo.png',
};

/* ── Animation helpers ── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
};

const float = (delay = 0, duration = 3) => ({
  y: [0, -12, 0],
  transition: {
    duration,
    repeat: Infinity,
    ease: 'easeInOut',
    delay,
  },
});

/* ── Component ── */
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

  const marqueBrands = [...brands, ...brands];

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative bg-[var(--bg-deep)] overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-[var(--info)]/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative max-w-[1400px] mx-auto px-4 py-16 sm:py-20 lg:py-28 text-center">
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
            Le catalogue qui réunit les dernières innovations. Comparez, achetez neuf ou
            vendez vos appareils d'occasion avec vérification vidéo obligatoire.
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

        {/* Hero image — left */}
        <motion.img
          src="../../public/images/phone.png"
          alt="Smartphone"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute left-4 lg:left-16 top-1/2 -translate-y-1/2 w-36 lg:w-56 xl:w-86 rotate-[-8deg] hidden md:block drop-shadow-2xl pointer-events-none"
        />

        {/* Hero image — right */}
        <motion.img
          src="../../public/images/tablet.png"
          alt="Tablet"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute right-4 lg:right-16 top-1/2 -translate-y-1/2 w-36 lg:w-56 xl:w-86 rotate-[8deg] hidden md:block drop-shadow-2xl pointer-events-none"
        />

        {/* Diamond decorations */}
        <motion.div
          initial={{ opacity: 0, rotate: 35 }}
          animate={{ opacity: 1, rotate: 45 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-10 right-10 w-24 lg:w-32 h-24 lg:h-32 border border-[var(--primary)]/20 hidden lg:block"
        />
        <motion.div
          initial={{ opacity: 0, rotate: 35 }}
          animate={{ opacity: 1, rotate: 45 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-10 left-10 w-16 lg:w-20 h-16 lg:h-20 border border-[var(--primary)]/10 hidden lg:block"
        />
      </section>

      {/* ══════════════════════════════════════════
          FLOATING CATEGORIES
      ══════════════════════════════════════════ */}
      <section className="max-w-9xl mx-auto -mt-20 px-4 py-12 sm:py-16">
        <div className="flex items-center justify-center gap-12 sm:gap-20 md:gap-28 lg:gap-36 flex-wrap">
          {categories.map((cat, i) => (
            <Link key={cat.name} to={`/catalogue?category=${cat.name}`} className="group">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div animate={float(i * 0.5, 2.5 + i * 0.3)} className="relative">
                  {/* Glow */}
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundColor: cat.color }}
                  />
                  {/* Icon */}
                  <div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-4xl sm:text-5xl transition-all duration-300 group-hover:scale-110"
                    style={{
                      borderColor: `${cat.color}30`,
                      backgroundColor: `${cat.color}08`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${cat.color}60`;
                      e.currentTarget.style.backgroundColor = `${cat.color}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${cat.color}30`;
                      e.currentTarget.style.backgroundColor = `${cat.color}08`;
                    }}
                  >
                    {cat.icon}
                  </div>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          POPULAR PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="bg-[var(--bg-base)] py-12 sm:py-16">
        <div className="max-w-9xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-6 sm:mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Produits populaires
            </h2>
            <Link to="/catalogue" className="text-[var(--primary)] hover:underline text-sm">
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

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="max-w-9xl mx-auto -mt-5 px-2 py-12 sm:py-16">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-8 sm:mb-10 text-center"
        >
          Comment ça marche ?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-22">
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
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 text-center relative group hover:border-[var(--primary)]/30 transition-all cursor-pointer"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {item.step}
              </div>
              <div className="text-4xl sm:text-7xl mb-4 mt-2 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-[var(--text-primary)] font-semibold text-2lx mb-2">{item.title}</h3>
              <p className="text-[var(--text-muted)] text-xl leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BRANDS MARQUEE
      ══════════════════════════════════════════ */}
      <section className="bg-[var(--bg-base)] py-12 sm:py-16 overflow-hidden">
        <div className="max-w-9xl mx-auto px-4 mb-8">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]"
          >
            Nos marques
          </motion.h2>
        </div>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div
            className="flex items-center gap-16 sm:gap-24 w-max"
            style={{ animation: 'marquee 20s linear infinite' }}
          >
            {marqueBrands.map((brand, i) => (
              <Link
                key={`${brand.name}-${i}`}
                to={`/catalogue?brand=${brand.name}`}
                className="shrink-0 group"
              >
                <img
                  src={brandLogos[brand.name]}
                  alt={brand.name}
                  className="h-10 sm:h-32 w-auto object-contain opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
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
            Rejoignez la marketplace TechPulse. Filmez votre produit, publiez votre annonce
            et vendez en toute confiance.
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