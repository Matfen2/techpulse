import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Track scroll for shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <nav className={`bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-[var(--border)] sticky top-0 z-50 transition-shadow ${
        scrolled ? 'shadow-lg shadow-black/10' : ''
      }`}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-[var(--orange)] shrink-0">
            TechPulse
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/catalogue', label: 'Catalogue' },
              { to: '/marketplace', label: 'Marketplace' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'text-[var(--orange)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-deep)]'
                }`}
              >
                {label}
                {isActive(to) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--orange)] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── Desktop right ── */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-deep)] transition-colors">
                  🛒
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[var(--orange)] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md shadow-[var(--orange)]/30">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-[var(--orange)]' : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-deep)]'
                  }`}
                >
                  {user?.firstName}
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin') ? 'text-[var(--orange)]' : 'text-[var(--orange)]/70 hover:text-[var(--orange)] hover:bg-[var(--orange)]/5'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition-colors cursor-pointer ml-1"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-[var(--bg-deep)]">
                  Connexion
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm bg-[var(--orange)] hover:opacity-90 text-white rounded-lg transition-opacity font-medium">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile right ── */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 text-[var(--text-muted)]">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[var(--orange)] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <div className="w-5 flex flex-col gap-1">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-5 bg-current rounded-full origin-center"
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  className="block h-0.5 w-5 bg-current rounded-full"
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-5 bg-current rounded-full origin-center"
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════ */}
      {/* ── Mobile fullscreen drawer ── */}
      {/* ══════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--bg-base)] border-l border-[var(--border)] z-50 md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="h-14 flex items-center justify-between px-5 border-b border-[var(--border)]">
                <span className="text-[var(--orange)] font-bold text-lg">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                {[
                  { to: '/', label: 'Accueil', icon: '🏠' },
                  { to: '/catalogue', label: 'Catalogue', icon: '📱' },
                  { to: '/marketplace', label: 'Marketplace', icon: '🏷️' },
                ].map(({ to, label, icon }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      to={to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(to)
                          ? 'bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/30'
                          : 'text-[var(--text-muted)] hover:bg-[var(--bg-deep)] hover:text-[var(--text)]'
                      }`}
                    >
                      <span>{icon}</span>
                      {label}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated && (
                  <>
                    <div className="h-px bg-[var(--border)] my-3" />
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                      <Link
                        to="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive('/dashboard')
                            ? 'bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/30'
                            : 'text-[var(--text-muted)] hover:bg-[var(--bg-deep)] hover:text-[var(--text)]'
                        }`}
                      >
                        <span>👤</span>
                        {user?.firstName} — Mon espace
                      </Link>
                    </motion.div>

                    {user?.role === 'admin' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 }}>
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--orange)]/70 hover:text-[var(--orange)] hover:bg-[var(--orange)]/5 transition-all"
                        >
                          <span>🔧</span>
                          Administration
                        </Link>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[var(--border)]">
                {isAuthenticated ? (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-center"
                  >
                    🚪 Déconnexion
                  </motion.button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition-colors text-center"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--orange)] text-white hover:opacity-90 transition-opacity text-center"
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;