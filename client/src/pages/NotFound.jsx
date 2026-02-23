import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* Glitch 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-bold text-[var(--primary)] leading-none select-none relative">
            404
            {/* Glitch layers */}
            <span
              className="absolute top-0 left-0 w-full text-[var(--info)] opacity-50 animate-pulse"
              style={{ clipPath: 'inset(20% 0 50% 0)', transform: 'translate(-4px, -2px)' }}
            >
              404
            </span>
            <span
              className="absolute top-0 left-0 w-full text-[var(--error)] opacity-50 animate-pulse"
              style={{ clipPath: 'inset(50% 0 20% 0)', transform: 'translate(4px, 2px)' }}
            >
              404
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Page introuvable
          </h2>
          <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            La page que vous cherchez n'existe pas ou a été déplacée. Peut-être une erreur dans l'URL ?
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors"
            >
              Retour à l'accueil
            </Link>
            <Link
              to="/catalogue"
              className="px-6 py-3 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] rounded-lg transition-colors"
            >
              Voir le catalogue
            </Link>
          </div>
        </motion.div>

        {/* Decorative broken grid */}
        <div className="mt-16 flex items-center justify-center gap-3 opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="w-8 h-8 border border-[var(--primary)] rotate-45"
              style={{ transform: `rotate(45deg) translateY(${i % 2 ? -5 : 5}px)` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;