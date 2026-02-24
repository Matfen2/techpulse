import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProductReviews, createReview, updateReview, deleteReview } from '../services/productService';

const StarInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`text-2xl cursor-pointer transition-colors ${
            star <= (hover || value) ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]/30'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ReviewSection = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data } = await getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const userReview = reviews.find((r) => r.user._id === user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Veuillez sélectionner une note');
    if (comment.trim().length < 3) return setError('Le commentaire doit faire au moins 3 caractères');

    setSubmitting(true);
    setError('');
    try {
      if (editingId) {
        await updateReview(editingId, { rating, comment });
        setEditingId(null);
      } else {
        await createReview(productId, { rating, comment });
      }
      setRating(0);
      setComment('');
      await fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setRating(0);
    setComment('');
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      await fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
        Avis clients ({reviews.length})
      </h2>

      {/* Review Form */}
      {isAuthenticated && !userReview && !editingId && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Donner votre avis</h3>
          {error && (
            <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Note</label>
              <StarInput value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Commentaire</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce produit..."
                rows={3}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Envoi...' : 'Publier'}
            </button>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingId && (
        <div className="bg-[var(--bg-card)] border border-[var(--primary)]/30 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">Modifier votre avis</h3>
          {error && (
            <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Note</label>
              <StarInput value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Commentaire</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Envoi...' : 'Modifier'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--text-muted)] transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center text-[var(--text-muted)]">Chargement des avis...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 text-center">
          <p className="text-[var(--text-muted)]">Aucun avis pour le moment. Soyez le premier !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className={`bg-[var(--bg-card)] border rounded-xl p-5 ${
                review.user._id === user?.id ? 'border-[var(--primary)]/30' : 'border-[var(--border)]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[var(--text-primary)] font-semibold text-sm">
                      {review.user.firstName} {review.user.lastName}
                    </span>
                    {review.user._id === user?.id && (
                      <span className="px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-xs">
                        Vous
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]/30'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-[var(--text-muted)] ml-2">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {review.user._id === user?.id && !editingId && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-xs text-[var(--info)] hover:underline cursor-pointer"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-xs text-[var(--error)] hover:underline cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[var(--text-secondary)] text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Not authenticated message */}
      {!isAuthenticated && (
        <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
          <a href="/login" className="text-[var(--primary)] hover:underline">Connectez-vous</a> pour donner votre avis
        </div>
      )}
    </div>
  );
};

export default ReviewSection;