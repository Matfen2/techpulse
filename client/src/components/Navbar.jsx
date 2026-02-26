import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-[var(--bg-base)] border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[var(--primary)]">
          TechPulse
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/catalogue"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Catalogue
          </Link>
          <Link
            to="/marketplace"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Marketplace
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-sm"
              >
                {user?.firstName}
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-[var(--primary)] text-sm hover:underline"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors cursor-pointer"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg transition-colors"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;