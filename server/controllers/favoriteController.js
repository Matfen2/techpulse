import User from '../models/User.js';

// ── GET /api/favorites — Liste des favoris ──
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      'favorites',
      'name slug image price brand category rating numReviews inStock'
    );

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── POST /api/favorites/:productId — Ajouter un favori ──
export const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.favorites.includes(req.params.productId)) {
      return res.status(409).json({ message: 'Produit déjà en favoris' });
    }

    user.favorites.push(req.params.productId);
    await user.save();

    res.status(201).json({ message: 'Ajouté aux favoris', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── DELETE /api/favorites/:productId — Retirer un favori ──
export const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();

    res.json({ message: 'Retiré des favoris', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};