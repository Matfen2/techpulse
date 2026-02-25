import User from '../models/User.js';
import Product from '../models/Product.js';
import Listing from '../models/Listing.js';
import Review from '../models/Review.js';

// ── GET /api/admin/stats — Dashboard stats ──
export const getStats = async (req, res) => {
  try {
    const [usersCount, productsCount, listingsCount, reviewsCount, pendingListings, activeListings] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Listing.countDocuments(),
        Review.countDocuments(),
        Listing.countDocuments({ status: 'pending' }),
        Listing.countDocuments({ status: 'active' }),
      ]);

    // Revenue (sum of active listing prices)
    const revenueAgg = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    // Recent users (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });

    // Listings by category
    const listingsByCategory = await Listing.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Listings by status
    const listingsByStatus = await Listing.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      users: usersCount,
      products: productsCount,
      listings: listingsCount,
      reviews: reviewsCount,
      pendingListings,
      activeListings,
      marketplaceRevenue: revenueAgg[0]?.total || 0,
      newUsersThisWeek,
      listingsByCategory: listingsByCategory.map((c) => ({ name: c._id || 'N/A', count: c.count })),
      listingsByStatus: listingsByStatus.map((s) => ({ name: s._id, count: s.count })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── GET /api/admin/users — Liste des utilisateurs ──
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── DELETE /api/admin/users/:id — Supprimer un utilisateur ──
export const deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Impossible de supprimer un admin' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── GET /api/admin/listings — Toutes les annonces (avec pending) ──
export const getAllListingsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const listings = await Listing.find(filter)
      .populate('seller', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};