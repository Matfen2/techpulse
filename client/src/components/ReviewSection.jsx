import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProductReviews, createReview, updateReview, deleteReview } from '../services/productService';

const StarInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5 sm:gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`text-lg sm:text-2xl cursor-pointer transition-colors ${
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
      setError(err.response?.data?.message || "Erreur lors de l'envoi");
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
    <div className="max-w-7xl mx-auto px-4 py-6 -mt-12 sm:py-10 lg:py-12">
      <h2 className="text-base sm:text-xl lg:text-2xl font-request text-[var(--text-primary)] mb-5 sm:mb-8">
        Avis clients ({reviews.length})
      </h2>

      {/* Review Form */}
      {isAuthenticated && !userReview && !editingId && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-sm sm:text-lg font-semibold text-[var(--text-primary)] mb-3 sm:mb-4 font-request">Donner votre avis</h3>
          {error && (
            <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] px-3 sm:px-4 py-2 rounded-lg mb-3 sm:mb-4 text-xs sm:text-sm font-qaranta">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-[10px] sm:text-sm font-qaranta text-[var(--text-secondary)] mb-1.5 sm:mb-2">Commentaire</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce produit..."
                rows={3}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg font-qaranta text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] resize-none"
              />
            </div>
            <div className="flex flex-row items-center justify-between gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-3 sm:px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-qaranta rounded-lg transition-colors disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
              >
                {submitting ? 'Envoi...' : 'Publier'}
              </button>
              <StarInput value={rating} onChange={setRating} />
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingId && (
        <div className="bg-[var(--bg-card)] border border-[var(--primary)]/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-sm sm:text-lg font-request text-[var(--primary)] mb-2">Modifier votre avis</h3>
          {error && (
            <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] font-qaranta px-3 sm:px-4 py-2 rounded-lg mb-2 text-xs sm:text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-[10px] sm:text-sm font-qaranta text-[var(--text-secondary)] mb-1.5 sm:mb-2">Commentaire</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[var(--bg-base)] border border-[var(--border)] font-qaranta rounded-lg text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] resize-none"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 sm:px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-qaranta rounded-lg transition-colors disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
                >
                  {submitting ? 'Envoi...' : 'Modifier'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 sm:px-4 py-2 border border-[var(--border)] font-qaranta text-[var(--text-secondary)] rounded-lg hover:border-[var(--text-muted)] transition-colors cursor-pointer text-xs sm:text-sm"
                >
                  Annuler
                </button>
              </div>
              <StarInput value={rating} onChange={setRating} />
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center font-request text-[var(--text-muted)] text-xs sm:text-sm">Chargement des avis...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 text-center">
          <p className="text-[var(--text-muted)] font-qaranta text-xs sm:text-sm">Aucun avis pour le moment. Soyez le premier !</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className={`bg-[var(--bg-card)] border rounded-xl p-3.5 sm:p-5 ${
                review.user._id === user?.id ? 'border-[var(--primary)]/30' : 'border-[var(--border)]'
              }`}
            >
              {/* Header: name + badges + actions */}
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[var(--text-primary)] font-request text-xs sm:text-sm">
                    {review.user.firstName} {review.user.lastName}
                  </span>
                  {review.user._id === user?.id && (
                    <span className="px-1.5 sm:px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] font-qaranta rounded text-[9px] sm:text-xs">
                      Vous
                    </span>
                  )}
                </div>

                {review.user._id === user?.id && !editingId && (
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-[10px] sm:text-xs text-[var(--info)] hover:underline cursor-pointer font-qaranta"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-[10px] sm:text-xs text-[var(--error)] hover:underline cursor-pointer font-qaranta"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>

              {/* Body: comment + stars + date */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <p className="text-[var(--text-secondary)] text-xs sm:text-sm font-qaranta flex-1">{review.comment}</p>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-[10px] sm:text-sm ${
                          i < review.rating ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]/30'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] sm:text-xs text-[var(--text-muted)] font-qaranta">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Not authenticated message */}
      {!isAuthenticated && (
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-[var(--text-muted)] font-qaranta">
          <a href="/login" className="text-[var(--primary)] hover:underline">Connectez-vous</a> pour donner votre avis
        </div>
      )}
    </div>
  );
};

export default ReviewSection;