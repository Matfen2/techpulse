import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createListing } from '../services/productService';

const categories = ['Smartphone', 'Laptop', 'Wearable', 'Accessoire'];
const conditions = ['Comme neuf', 'Très bon état', 'Bon état', 'État correct'];

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-4xl mb-4">🔒</div>
        <p className="text-[var(--text-muted)] mb-4">Connectez-vous pour publier une annonce</p>
        <Link to="/login" className="text-[var(--primary)] hover:underline">Se connecter</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
          <Link to="/marketplace" className="hover:text-[var(--primary)] transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]">Nouvelle annonce</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Publier une annonce</h1>
        <p className="text-[var(--text-muted)]">
          La vidéo de vérification est obligatoire pour prouver l'état de votre produit 🔒
        </p>
      </div>

      {error && (
        <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Informations</h2>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Titre de l'annonce</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: iPhone 15 Pro Max 256Go Noir"
              required
              className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre produit en détail (état, accessoires inclus, raison de la vente...)"
              required
              rows={4}
              className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Prix (€)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 850"
                required
                min="1"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Localisation</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Paris 75011"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Catégorie</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">État</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
              >
                <option value="">Sélectionner</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Vidéo de vérification</h2>
            <span className="px-2 py-0.5 bg-[var(--error)]/10 text-[var(--error)] rounded text-xs">Obligatoire</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Filmez votre produit sous tous les angles pour prouver son état. Durée recommandée : 15-60 secondes.
          </p>

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-[var(--primary)] transition-colors">
              {videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  className="max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <>
                  <div className="text-4xl mb-3">🎥</div>
                  <p className="text-[var(--text-secondary)] text-sm">Cliquez pour sélectionner une vidéo</p>
                  <p className="text-[var(--text-muted)] text-xs mt-1">MP4, WebM, MOV — Max 100 Mo</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
          </label>
          {video && (
            <p className="text-xs text-[var(--success)]">
              ✓ {video.name} ({(video.size / 1024 / 1024).toFixed(1)} Mo)
            </p>
          )}
        </div>

        {/* Images */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Photos</h2>
            <span className="px-2 py-0.5 bg-[var(--info)]/10 text-[var(--info)] rounded text-xs">Optionnel</span>
          </div>

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--primary)] transition-colors">
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-5 gap-3">
                  {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-full h-20 object-cover rounded-lg" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-[var(--text-secondary)] text-sm">Ajouter jusqu'à 5 photos</p>
                </>
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
        </div>

        {/* Progress bar */}
        {loading && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-secondary)]">Upload en cours...</span>
              <span className="text-sm text-[var(--primary)]">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[var(--bg-base)] rounded-full h-2">
              <div
                className="bg-[var(--primary)] h-2 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer text-lg"
        >
          {loading ? 'Publication en cours...' : 'Publier l\'annonce'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;