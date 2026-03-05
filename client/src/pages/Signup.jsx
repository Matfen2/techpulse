import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// ── Password strength ──
const getPasswordStrength = (pw) => {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: 'Faible', color: '#ef4444' };
  if (score === 2) return { level: 2, label: 'Moyen', color: '#f59e0b' };
  if (score === 3) return { level: 3, label: 'Bon', color: '#06b6d4' };
  return { level: 4, label: 'Fort', color: '#10b981' };
};

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      await signup(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  // Progress steps
  const step1 = formData.firstName && formData.lastName;
  const step2 = formData.email;
  const step3 = formData.password && passwordsMatch;
  const completedSteps = [step1, step2, step3].filter(Boolean).length;

  return (
    <div className="min-h-[85vh] bg-[var(--bg-deep)] flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Background glow */}
      <div
        className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)',
          left: '50%',
          top: '45%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-block">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl sm:text-3xl font-bold text-[var(--orange)] inline-block"
            >
              TechPulse
            </motion.span>
          </Link>
          <p className="text-sm text-[var(--text-muted)] font-request mt-2">Créez votre compte TechPulse</p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {['Identité', 'Email', 'Sécurité'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[20px] font-qaranta font-bold transition-all ${
                  i < completedSteps
                    ? 'bg-emerald-500 text-white'
                    : i === completedSteps
                      ? 'bg-[var(--orange)] text-white'
                      : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]'
                }`}>
                  {i < completedSteps ? '✓' : i + 1}
                </div>
                {i < 2 && (
                  <div className={`w-6 sm:w-8 h-0.5 rounded ${i < completedSteps ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />
                )}
              </div>
            ))}
          </div>
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
                className="bg-red-500/10 border border-red-500/30 text-red-400 font-qaranta px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
              >
                <span>⚠️</span>
                <span className="flex-1">{error}</span>
                <button onClick={() => setError('')} className="text-red-400/50 hover:text-red-400 font-qaranta cursor-pointer">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">👤</span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Prénom"
                    required
                    className="w-full pl-10 pr-3 py-3 font-qaranta bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nom"
                  required
                  className="w-full px-4 py-3 font-qaranta bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
                />
              </div>
            </div>

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
              <label className="block text-xs font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 caractères"
                  required
                  className="w-full pl-11 pr-12 py-3 bg-[var(--bg-deep)] font-qaranta border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Strength bar */}
              <AnimatePresence>
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[var(--bg-deep)] rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <motion.div
                            key={level}
                            className="flex-1 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{
                              scaleX: level <= passwordStrength.level ? 1 : 0,
                              backgroundColor: level <= passwordStrength.level ? passwordStrength.color : 'var(--border)',
                            }}
                            transition={{ delay: level * 0.05 }}
                            style={{ originX: 0 }}
                          />
                        ))}
                      </div>
                      <span className="text-[17px] font-qaranta font-medium" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                      {[
                        { test: formData.password.length >= 8, label: '8+ caractères' },
                        { test: /[A-Z]/.test(formData.password), label: '1 majuscule' },
                        { test: /[0-9]/.test(formData.password), label: '1 chiffre' },
                        { test: /[^A-Za-z0-9]/.test(formData.password), label: '1 spécial' },
                      ].map(({ test, label }) => (
                        <span key={label} className={`text-[15px] font-qaranta flex items-center gap-1 ${test ? 'text-emerald-400' : 'text-[var(--text-muted)]/50'}`}>
                          {test ? '✓' : '○'} {label}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block font-qaranta text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔒</span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-11 pr-12 font-qaranta py-3 bg-[var(--bg-deep)] border rounded-xl text-md text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5 ${
                    formData.confirmPassword
                      ? passwordsMatch
                        ? 'border-emerald-500/50 focus:border-emerald-500'
                        : 'border-red-500/50 focus:border-red-500'
                      : 'border-[var(--border)] focus:border-[var(--orange)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer text-sm"
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              <AnimatePresence>
                {formData.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-[15px] mt-1.5 font-qaranta flex items-center gap-1 ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {passwordsMatch ? '✓ Les mots de passe correspondent' : '✕ Les mots de passe ne correspondent pas'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-32 block mx-auto py-3 font-request rounded-xl transition-all text-sm cursor-pointer mt-2 ${
                loading
                  ? 'bg-[var(--orange)]/50 text-white/50'
                  : 'bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white hover:shadow-xl hover:shadow-[var(--orange)]/25'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 font-request border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Inscription...
                </span>
              ) : (
                "S'inscrire"
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
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[var(--orange)] hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </motion.div>

        {/* Footer link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-xs font-request text-[var(--text-muted)]"
        >
          <Link to="/" className="hover:text-[var(--orange)] transition-colors">← Retour à l'accueil</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;