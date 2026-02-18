import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  const { signup } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-[var(--primary)]">
            TechPulse
          </Link>
          <p className="text-[var(--text-muted)] mt-2">Créez votre compte TechPulse</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8">
          {error && (
            <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Prénom"
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nom"
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemple.com"
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 caractères, 1 maj, 1 chiffre"
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-48 mx-auto block py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>

          <p className="text-center text-[var(--text-muted)] mt-6 text-sm">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[var(--primary)] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;