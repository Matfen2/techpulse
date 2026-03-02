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

    // Products by brand (for donut chart)
    const productsByBrand = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Products by category (for bar chart)
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } },
    ]);

    // Recent reviews (last 5)
    const recentReviews = await Review.find()
      .populate('user', 'firstName lastName')
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Average rating
    const ratingAgg = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } },
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
      averageRating: ratingAgg[0]?.avg || 0,
      listingsByCategory: listingsByCategory.map((c) => ({ name: c._id || 'N/A', count: c.count })),
      listingsByStatus: listingsByStatus.map((s) => ({ name: s._id, count: s.count })),
      productsByBrand: productsByBrand.map((b) => ({ name: b._id, count: b.count })),
      productsByCategory: productsByCategory.map((c) => ({ name: c._id || 'N/A', count: c.count, avgPrice: Math.round(c.avgPrice) })),
      recentReviews: recentReviews.map((r) => ({
        _id: r._id,
        rating: r.rating,
        comment: r.comment,
        user: r.user ? `${r.user.firstName} ${r.user.lastName}` : 'Anonyme',
        product: r.product?.name || 'Produit supprimé',
        createdAt: r.createdAt,
      })),
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