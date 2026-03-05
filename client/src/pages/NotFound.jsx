import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// ── Floating particle ──
const Particle = ({ delay, x, size }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      bottom: '-10%',
      background: 'var(--orange)',
      opacity: 0.15,
    }}
    animate={{
      y: [0, -800],
      opacity: [0.15, 0],
      scale: [1, 0.3],
    }}
    transition={{
      duration: 8 + delay * 2,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  />
);

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <Particle
            key={i}
            delay={i * 1.2}
            x={10 + i * 11}
            size={4 + (i % 3) * 4}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div
        className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="text-center relative z-10">

        {/* ── Glitch 404 ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="relative mb-6 sm:mb-8"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <h1 className="text-[120px] sm:text-[180px] md:text-[220px] font-request leading-none select-none relative">
            {/* Main text */}
            <span className="relative z-10 bg-gradient-to-b from-[var(--orange)] to-amber-700 bg-clip-text text-transparent">
              404
            </span>

            {/* Glitch layer 1 */}
            <motion.span
              className="absolute top-0 left-0 w-full text-sky-500/40 font-request"
              animate={{
                x: [-3, 3, -2, 0],
                opacity: [0.4, 0.6, 0.3, 0.4],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ clipPath: 'inset(15% 0 55% 0)' }}
            >
              404
            </motion.span>

            {/* Glitch layer 2 */}
            <motion.span
              className="absolute top-0 left-0 w-full text-red-500/40 font-request"
              animate={{
                x: [3, -3, 2, 0],
                opacity: [0.3, 0.5, 0.4, 0.3],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{ clipPath: 'inset(55% 0 15% 0)' }}
            >
              404
            </motion.span>

            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-[var(--orange)]/20 pointer-events-none"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </h1>
        </motion.div>

        {/* ── Text ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          <h2 className="text-xl sm:text-3xl font-request text-[var(--text)] mb-3">
            Page introuvable
          </h2>
          <p className="text-sm sm:text-lg font-qaranta text-[var(--text-muted)] mb-8 leading-relaxed">
            La page que vous cherchez n'existe pas ou a été déplacée.
            Peut-être une erreur dans l'URL ?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/"
                className="inline-block p-3 bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white font-qaranta rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-[var(--orange)]/25 text-sm sm:text-base w-full sm:w-auto text-center"
              >
                ← Retour à l'accueil
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/catalogue"
                className="inline-block px-3 py-3 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] font-qaranta hover:border-[var(--orange)] rounded-xl transition-all hover:scale-105 text-sm sm:text-base w-full sm:w-auto text-center"
              >
                Voir le catalogue
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Decorative broken circuit ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3"
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08, type: 'spring' }}
              className="border border-[var(--orange)] rounded-sm"
              style={{
                width: `${6 + (i % 3) * 4}px`,
                height: `${6 + (i % 3) * 4}px`,
                transform: `rotate(45deg) translateY(${i % 2 ? -4 : 4}px)`,
              }}
            />
          ))}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="w-8 sm:w-12 h-[1px] bg-[var(--orange)]/20"
          />
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={`r-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.08, type: 'spring' }}
              className="border border-[var(--orange)] rounded-sm"
              style={{
                width: `${6 + (i % 3) * 4}px`,
                height: `${6 + (i % 3) * 4}px`,
                transform: `rotate(45deg) translateY(${i % 2 ? 4 : -4}px)`,
              }}
            />
          ))}
        </motion.div>

        {/* ── Quick links ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 flex items-center justify-center gap-4 text-md font-qaranta text-[var(--text-muted)]"
        >
          <Link to="/catalogue" className="hover:text-[var(--orange)] transition-colors hover:scale-105">Catalogue</Link>
          <span className="text-[var(--border)]">•</span>
          <Link to="/marketplace" className="hover:text-[var(--orange)] transition-colors hover:scale-105">Marketplace</Link>
          <span className="text-[var(--border)]">•</span>
          <Link to="/login" className="hover:text-[var(--orange)] transition-colors hover:scale-105">Connexion</Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;