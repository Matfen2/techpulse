import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createListing } from '../services/productService';

const categories = ['Smartphone', 'Laptop', 'Wearable', 'Accessoire'];
const conditions = ['Comme neuf', 'Très bon état', 'Bon état', 'État correct'];

const CATEGORY_ICONS = {
  Smartphone: '📱',
  Laptop: '💻',
  Wearable: '⌚',
  Accessoire: '🎧',
};

const CONDITION_CONFIG = {
  'Comme neuf': { color: '#10b981', bg: 'rgba(16,185,129,0.12)', desc: 'Aucune trace d\'usure' },
  'Très bon état': { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', desc: 'Micro-rayures invisibles' },
  'Bon état': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', desc: 'Traces d\'usure légères' },
  'État correct': { color: '#9ca3af', bg: 'rgba(156,163,175,0.12)', desc: 'Usure visible, fonctionne' },
};

const CreateListing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
  });
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);
  const [videoPreview, setVideoPreview] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-[var(--text-muted)] font-request mb-4 text-2xl">Connectez-vous pour publier une annonce</p>
          <Link to="/login" className="px-3 py-2.5 bg-[var(--orange)] text-white text-xl rounded-lg font-qaranta transition-all hover:scale-105">
            Se connecter
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const selectCategory = (cat) => {
    setFormData({ ...formData, category: formData.category === cat ? '' : cat });
    setError('');
  };

  const selectCondition = (cond) => {
    setFormData({ ...formData, condition: formData.condition === cond ? '' : cond });
    setError('');
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        return setError('La vidéo ne doit pas dépasser 100 Mo');
      }
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview('');
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) return setError('La vidéo de vérification est obligatoire');
    if (!formData.category) return setError('Veuillez sélectionner une catégorie');
    if (!formData.condition) return setError('Veuillez sélectionner l\'état du produit');

    setLoading(true);
    setUploadProgress(10);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      data.append('video', video);
      images.forEach((img) => data.append('images', img));

      setUploadProgress(30);
      await createListing(data);
      setUploadProgress(100);

      navigate('/marketplace');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Progress steps
  const completedSteps = [
    formData.title && formData.description && formData.price && formData.category && formData.condition,
    !!video,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] py-6 sm:py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ── Breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm font-qaranta text-[var(--text-muted)] mb-4 sm:mb-6"
        >
          <Link to="/marketplace" className="hover:text-[var(--orange)] transition-colors">Marketplace</Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--text)]">Nouvelle annonce</span>
        </motion.div>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-4xl font-request text-[var(--text)] mb-2">Publier une annonce</h1>
          <p className="text-xl text-[var(--text-muted)] font-qaranta">
            La vidéo de vérification est obligatoire pour prouver l'état de votre produit 🔒
          </p>

          {/* Progress indicator */}
          <div className="flex items-center justify-center font-qaranta gap-3 mt-4">
            {['Informations', 'Vidéo', 'Photos'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-6 h-6 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xl font-qaranta transition-all ${
                  i < completedSteps
                    ? 'bg-emerald-500 text-white'
                    : i === completedSteps
                      ? 'bg-[var(--orange)] text-white'
                      : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]'
                }`}>
                  {i < completedSteps ? '✓' : i + 1}
                </div>
                <span className={`text-xs sm:text-sm hidden sm:block ${
                  i <= completedSteps ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
                }`}>
                  {step}
                </span>
                {i < 2 && (
                  <div className={`w-6 sm:w-10 h-0.5 rounded ${
                    i < completedSteps ? 'bg-emerald-500' : 'bg-[var(--border)]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 font-qaranta px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
            >
              <span>⚠️</span>
              {error}
              <button onClick={() => setError('')} className="ml-auto text-red-400/50 hover:text-red-400 cursor-pointer">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

          {/* ══════════════════════════════════════════ */}
          {/* ── Section 1: Informations ── */}
          {/* ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 space-y-5"
          >
            <h2 className="text-base sm:text-lg font-request text-[var(--text)] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[var(--orange)]/10 text-[var(--orange)] flex items-center font-request justify-center text-sm">1</span>
              Informations
            </h2>

            {/* Title */}
            <div>
              <label className="block text-md font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Titre de l'annonce
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: iPhone 15 Pro Max 256Go Noir"
                required
                maxLength={100}
                className="w-full px-4 py-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-sm font-qaranta text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
              />
              <p className="text-right text-[10px] text-[var(--text-muted)]/50 mt-1">{formData.title.length}/100</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-md font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre produit en détail (état, accessoires inclus, raison de la vente...)"
                required
                rows={4}
                className="w-full px-4 py-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-sm font-qaranta text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all resize-none focus:shadow-lg focus:shadow-[var(--orange)]/5"
              />
            </div>

            {/* Price + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-md font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Prix (€)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="850"
                    required
                    min="1"
                    className="w-full pl-4 pr-10 py-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-sm font-qaranta text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all font-mono focus:shadow-lg focus:shadow-[var(--orange)]/5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm font-mono">€</span>
                </div>
              </div>
              <div>
                <label className="block text-md font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Localisation
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">📍</span>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Paris 75011"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-sm font-qaranta text-[var(--text)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--orange)] transition-all focus:shadow-lg focus:shadow-[var(--orange)]/5"
                  />
                </div>
              </div>
            </div>

            {/* Category pills */}
            <div>
              <label className="block text-md font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Catégorie
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectCategory(cat)}
                    className={`p-3 rounded-xl border text-sm font-qaranta transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      formData.category === cat
                        ? 'bg-[var(--orange)]/10 border-[var(--orange)] text-[var(--orange)] shadow-md shadow-[var(--orange)]/10'
                        : 'bg-[var(--bg-deep)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--orange)]/50 hover:text-[var(--text)]'
                    }`}
                  >
                    <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Condition pills */}
            <div>
              <label className="block text-md font-qaranta text-[var(--text-muted)] uppercase tracking-wider mb-3">
                État du produit
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {conditions.map((cond) => {
                  const cfg = CONDITION_CONFIG[cond];
                  const isActive = formData.condition === cond;
                  return (
                    <motion.button
                      key={cond}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => selectCondition(cond)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'shadow-md'
                          : 'bg-[var(--bg-deep)] border-[var(--border)] hover:border-[var(--border)]'
                      }`}
                      style={isActive ? {
                        backgroundColor: cfg.bg,
                        borderColor: cfg.color + '50',
                        boxShadow: `0 4px 16px ${cfg.bg}`,
                      } : {}}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cfg.color }}
                        />
                        <span
                          className={`text-sm font-qaranta ${isActive ? '' : 'text-[var(--text)]'}`}
                          style={isActive ? { color: cfg.color } : {}}
                        >
                          {cond}
                        </span>
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto text-xs"
                            style={{ color: cfg.color }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </div>
                      <p className="text-[10px] font-qaranta sm:text-xs text-[var(--text-muted)] ml-4.5">{cfg.desc}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════ */}
          {/* ── Section 2: Vidéo ── */}
          {/* ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <h2 className="sm:text-lg font-request flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 font-request flex items-center justify-center text-sm">2</span>
                Vidéo de vérification
              </h2>
              <span className="px-2 py-0.5 font-request bg-red-500/10 text-red-400 rounded-full text-[10px] sm:text-xs font-medium">
                Obligatoire
              </span>
            </div>
            <p className="text-xs sm:text-sm font-qaranta text-[var(--text-muted)]">
              Filmez votre produit sous tous les angles pour prouver son état. Durée recommandée : 15-60 secondes.
            </p>

            <label className="block cursor-pointer group">
              <div className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                videoPreview
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-[var(--border)] hover:border-[var(--orange)] hover:bg-[var(--orange)]/5 group-hover:shadow-lg group-hover:shadow-[var(--orange)]/5'
              }`}>
                {videoPreview ? (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      controls
                      className="max-h-48 sm:max-h-64 mx-auto rounded-xl border border-[var(--border)]"
                    />
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.preventDefault(); removeVideo(); }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer shadow-lg"
                    >
                      ✕
                    </motion.button>
                  </div>
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <div className="text-4xl sm:text-5xl mb-3">🎥</div>
                    <p className="text-sm text-[var(--text)] font-qaranta mb-1">Cliquez pour ajouter une vidéo</p>
                    <p className="text-[10px] sm:text-xs font-qaranta text-[var(--text-muted)]">MP4, WebM, MOV — Max 100 Mo</p>
                  </motion.div>
                )}
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>

            <AnimatePresence>
              {video && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-emerald-400 flex items-center gap-1.5"
                >
                  <span className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
                  {video.name} ({(video.size / 1024 / 1024).toFixed(1)} Mo)
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ══════════════════════════════════════════ */}
          {/* ── Section 3: Photos ── */}
          {/* ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <h2 className="font-request sm:text-lg font-bold text-[var(--text)] flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex font-request items-center justify-center text-sm">3</span>
                Photos
              </h2>
              <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded-full text-[10px] sm:text-xs font-request">
                Optionnel
              </span>
            </div>

            <label className="block cursor-pointer group">
              <div className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center transition-all ${
                imagePreviews.length > 0
                  ? 'border-sky-500/30 bg-sky-500/5'
                  : 'border-[var(--border)] hover:border-[var(--orange)] hover:bg-[var(--orange)]/5 group-hover:shadow-lg group-hover:shadow-[var(--orange)]/5'
              }`}>
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group/img">
                        <img
                          src={src}
                          alt=""
                          className="w-full h-16 sm:h-20 object-cover rounded-xl border border-[var(--border)]"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); removeImage(i); }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer shadow-md"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < 5 && (
                      <div className="h-16 sm:h-20 border-2 border-dashed border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--text-muted)] text-lg hover:border-[var(--orange)] transition-colors">
                        +
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <div className="text-3xl sm:text-4xl mb-2">📷</div>
                    <p className="text-sm text-[var(--text)] font-qaranta mb-1">Ajouter jusqu'à 5 photos</p>
                    <p className="text-[10px] sm:text-xs font-qaranta text-[var(--text-muted)]">JPG, PNG, WebP</p>
                  </motion.div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>
          </motion.div>

          {/* ── Upload Progress ── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[var(--bg-card)] border border-[var(--orange)]/30 rounded-2xl p-4 sm:p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[var(--text)] font-request">Upload en cours...</span>
                  <span className="text-sm text-[var(--orange)] font-qaranta">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[var(--bg-deep)] rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-[var(--orange)] to-amber-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Submit ── */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-58 block mx-auto py-3.5 sm:py-4 font-qaranta rounded-2xl transition-all hover:scale-105 text-base sm:text-lg cursor-pointer ${
              loading
                ? 'bg-[var(--orange)]/50 text-white/50'
                : 'bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white hover:shadow-xl hover:shadow-[var(--orange)]/25'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publication en cours...
              </span>
            ) : (
              'Publier l\'annonce'
            )}
          </motion.button>

        </form>
      </div>
    </div>
  );
};

export default CreateListing;