import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts, getBrands } from '../services/productService';
import ProductCard from '../components/ProductCard';

/* ── Constants ── */
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

/* ── Skeleton ── */
const ProductSkeleton = () => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse">
    <div className="h-36 sm:h-48 bg-[var(--bg-base)]" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/4 bg-[var(--bg-base)] rounded" />
      <div className="h-3 w-1/2 bg-[var(--bg-base)] rounded" />
      <div className="flex justify-between pt-2">
        <div className="h-4 w-16 bg-[var(--bg-base)] rounded" />
        <div className="h-3 w-10 bg-[var(--bg-base)] rounded" />
      </div>
    </div>
  </div>
);

/* ── Component ── */
const Home = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [brands, setBrands] = useState([]);
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
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
              backgroundImage: 'radial-gradient(circle at 1px 1px, var(--orange) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-[var(--orange)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-36 sm:w-48 h-36 sm:h-48 bg-[var(--info)]/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative max-w-[1400px] mx-auto px-4 py-14 sm:py-20 lg:py-28 text-center">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 bg-gradient-to-br from-[var(--orange)] to-orange-500 text-white rounded-full text-[10px] sm:text-xs lg:text-sm font-medium mb-5 sm:mb-6 shadow-lg shadow-[var(--orange)]/25 font-request"
          >
            🔶 Catalogue & Marketplace High-Tech
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--text)] mb-4 sm:mb-6 leading-tight font-qaranta max-w-3xl mx-auto"
          >
            Découvrez les meilleurs
            <br />
            <span className="bg-gradient-to-tr from-[var(--orange)] to-orange-500 bg-clip-text text-transparent inline-block mt-1">
              produits tech
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[var(--text-muted)] font-request text-xs sm:text-sm lg:text-base max-w-xl lg:max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
          >
            Le catalogue qui réunit les dernières innovations. Comparez, achetez neuf ou
            vendez vos appareils d'occasion avec vérification vidéo obligatoire.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4"
          >
            <Link
              to="/catalogue"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-[var(--orange)] to-orange-500 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-[var(--orange)]/25 text-center text-sm sm:text-base font-qaranta"
            >
              Explorer le catalogue
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--orange)] rounded-xl transition-all hover:scale-105 text-center text-sm sm:text-base font-qaranta"
            >
              Créer un compte
            </Link>
          </motion.div>
        </div>

        {/* Hero images — hidden until xl (1280px+) to avoid overlap */}
        <motion.img
          src="/images/phone.png"
          alt="Smartphone"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute left-6 xl:left-16 top-1/2 -translate-y-1/2 w-40 xl:w-56 2xl:w-72 rotate-[-8deg] hidden xl:block drop-shadow-2xl pointer-events-none"
        />
        <motion.img
          src="/images/tablet.png"
          alt="Tablet"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute right-6 xl:right-16 top-1/2 -translate-y-1/2 w-40 xl:w-56 2xl:w-72 rotate-[8deg] hidden xl:block drop-shadow-2xl pointer-events-none"
        />
      </section>

      {/* ══════════════════════════════════════════
          POPULAR PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="bg-[var(--bg-base)] py-8 sm:py-10">
        <div className="max-w-8xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-5 sm:mb-8"
          >
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-[var(--text)] font-qaranta">
              Produits populaires
            </h2>
            <Link to="/catalogue" className="text-[var(--orange)] hover:underline text-xs sm:text-sm font-qaranta">
              Voir tout →
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {popularProducts.slice(0, 8).map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="text-base sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-6 sm:mb-10 text-center font-qaranta"
        >
          Comment ça marche ?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-10">
          {[
            { icon: '📹', title: 'Filmez votre produit', desc: 'Enregistrez une vidéo de votre appareil en fonctionnement pour prouver son état.' },
            { icon: '🛡️', title: 'Vérification admin', desc: 'Notre équipe vérifie la vidéo et approuve votre annonce avant publication.' },
            { icon: '🤝', title: 'Achat sécurisé', desc: 'Les acheteurs achètent en confiance grâce à la vérification vidéo obligatoire.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 lg:p-8 text-center group hover:border-[var(--orange)]/30 transition-all"
            >
              <div className="text-2xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-[var(--text)] font-semibold text-xs sm:text-base lg:text-xl mb-2 font-qaranta">{item.title}</h3>
              <p className="text-[var(--text-muted)] text-[10px] sm:text-xs lg:text-sm leading-relaxed font-request">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BRANDS MARQUEE
      ══════════════════════════════════════════ */}
      {brands.length > 0 && (
        <section className="bg-[var(--bg-base)] py-8 sm:py-10 overflow-hidden">
          <div className="max-w-8xl mx-auto px-4 mb-6 sm:mb-8">
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.4 }}
              className="text-base sm:text-xl lg:text-2xl font-bold text-[var(--text)] font-qaranta"
            >
              Nos marques
            </motion.h2>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-r from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-l from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />

            <div
              className="flex items-center gap-12 sm:gap-24 w-max"
              style={{ animation: 'marquee 10s linear infinite' }}
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
                    className="h-20 sm:h-28 lg:h-28 w-auto object-contain opacity-30 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-[var(--text)]/20 rounded-2xl p-5 sm:p-8 lg:p-10 text-center bg-gradient-to-br from-[var(--orange)]/10 to-transparent"
        >
          <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-3 font-qaranta">
            Prêt à vendre vos appareils ?
          </h2>
          <p className="text-[var(--text-muted)] font-request mb-5 sm:mb-6 max-w-xl mx-auto text-xs sm:text-sm lg:text-base">
            Rejoignez la marketplace TechPulse. Filmez votre produit, publiez votre annonce
            et vendez en toute confiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/marketplace/new"
              className="px-6 sm:px-3 py-3 bg-gradient-to-r from-[var(--orange)] to-orange-500 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:scale-105 hover:shadow-[var(--orange)]/25 text-sm sm:text-base font-qaranta"
            >
              Déposer une annonce
            </Link>
            <Link
              to="/marketplace"
              className="px-6 sm:px-3 py-3 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--orange)] rounded-xl transition-all hover:scale-105 text-sm sm:text-base font-qaranta"
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