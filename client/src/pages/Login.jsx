import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[var(--bg-deep)] flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Background glow */}
      <div
        className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)',
          left: '50%',
          top: '40%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" className="inline-block">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl sm:text-3xl font-request font-bold text-[var(--orange)] inline-block"
            >
              TechPulse
            </motion.span>
          </Link>
          <p className="text-md text-[var(--text-muted)] font-qaranta mt-2">Connectez-vous à votre compte</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/10"
        >
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 font-request text-center px-4 py-1 rounded-xl mb-6 text-sm flex items-center gap-2"
              >
                <span className="flex-1">{error}</span>
                <button onClick={() => setError('')} className="text-red-400/50 font-qaranta hover:text-red-400 cursor-pointer">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemple.com"
                  required
                  className="w-full pl-11 pr-4 py-3 font-qaranta bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-qaranta font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 font-qaranta pr-12 py-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-40 block mx-auto py-3 font-request rounded-xl transition-all text-sm cursor-pointer ${
                loading
                  ? 'bg-[var(--orange)]/50 text-white/50'
                  : 'bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white hover:shadow-xl hover:shadow-[var(--orange)]/25'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 font-request border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[15px] text-[var(--text-muted)] font-qaranta uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <p className="text-center font-qaranta text-[var(--text-muted)] text-md">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-[var(--orange)] hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </motion.div>

        {/* Footer link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center font-request mt-6 text-md text-[var(--text-muted)]"
        >
          <Link to="/" className="hover:text-[var(--orange)] transition-colors">← Retour à l'accueil</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;