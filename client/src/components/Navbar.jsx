import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`block transition-colors text-xl ${
        isActive(to) ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-[var(--bg-base)] border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-9xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[var(--primary)]">
          TechPulse
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {navLink('/catalogue', 'Catalogue')}
          {navLink('/marketplace', 'Marketplace')}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[var(--primary)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-xl">
                {user?.firstName}
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-[var(--primary)] text-xl hover:underline">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 text-xl border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors cursor-pointer"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center -ml-6 gap-3">
              <Link to="/login" className="px-4 py-2 text-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Connexion
              </Link>
              <Link to="/signup" className="px-4 py-2 text-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg transition-colors">
                S'inscrire
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {isAuthenticated && (
            <Link to="/cart" className="relative text-[var(--text-secondary)]">
              🛒
              {cartCount > 0 && (
                <span className="bg-[var(--primary)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-2xl"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu animé */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--bg-base)]"
          >
            <div className="px-4 py-4 text-center text-2xl space-y-4">
              {navLink('/catalogue', 'Catalogue')}
              {navLink('/marketplace', 'Marketplace')}

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                    👤 {user?.firstName} — Mon espace
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-[var(--primary)]">
                      🔧 Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="block w-full text-left text-red-400 hover:text-red-300 transition-colors"
                  >
                    🚪 Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    Connexion
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="px-4 py-2 w-36 mx-auto bg-[var(--primary)] text-white rounded-lg text-2xl text-center hover:bg-[var(--primary-hover)] transition-colors">
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;