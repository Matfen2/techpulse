import Review from '../models/Review.js';
import Product from '../models/Product.js';

// ── GET /api/reviews/:productId — Avis d'un produit ──
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── POST /api/reviews/:productId — Créer un avis ──
export const createReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      product: req.params.productId,
    });
    if (existingReview) {
      return res.status(409).json({ message: 'Vous avez déjà donné votre avis sur ce produit' });
    }

    const review = await Review.create({
      user: req.user.id,
      product: req.params.productId,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    const populated = await review.populate('user', 'firstName lastName');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: 'Erreur de validation', error: err.message });
  }
};

// ── PUT /api/reviews/:id — Modifier son avis ──
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres avis' });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    const populated = await review.populate('user', 'firstName lastName');

    res.json(populated);
  } catch (err) {
    res.status(400).json({ message: 'Erreur de mise à jour', error: err.message });
  }
};

// ── DELETE /api/reviews/:id — Supprimer son avis ──
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    if (review.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: 'Avis supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── GET /api/reviews/user/me — Mes avis ──
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name slug image price brand category')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};