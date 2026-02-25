import Listing from '../models/Listing.js';
import cloudinary from '../config/cloudinary.js';

// ── Helper: upload buffer to Cloudinary ──
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });
};

// ── GET /api/listings — Liste des annonces actives ──
export const getListings = async (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;

    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Listing.countDocuments(filter);
    const listings = await Listing.find(filter)
      .populate('seller', 'firstName lastName sellerRating sellerSales')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      listings,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── GET /api/listings/my — Mes annonces ──
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── GET /api/listings/:slug — Détail annonce ──
export const getListingBySlug = async (req, res) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug }).populate(
      'seller',
      'firstName lastName sellerRating sellerSales createdAt'
    );
    if (!listing) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── POST /api/listings — Créer une annonce ──
export const createListing = async (req, res) => {
  try {
    const { title, description, price, category, condition, location } = req.body;

    // Upload video (required)
    if (!req.files?.video?.[0]) {
      return res.status(400).json({ message: 'La vidéo de vérification est obligatoire' });
    }

    const videoFile = req.files.video[0];
    const videoResult = await uploadToCloudinary(videoFile.buffer, {
      resource_type: 'video',
      folder: 'techpulse/listings/videos',
      transformation: [{ quality: 'auto', fetch_format: 'mp4' }],
    });

    // Upload images (optional)
    const images = [];
    if (req.files?.images) {
      for (const imageFile of req.files.images) {
        const imgResult = await uploadToCloudinary(imageFile.buffer, {
          resource_type: 'image',
          folder: 'techpulse/listings/images',
          transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
        });
        images.push({ url: imgResult.secure_url, publicId: imgResult.public_id });
      }
    }

    const listing = await Listing.create({
      title,
      description,
      price: Number(price),
      category,
      condition,
      location: location || '',
      seller: req.user.id,
      video: {
        url: videoResult.secure_url,
        publicId: videoResult.public_id,
        duration: videoResult.duration,
      },
      images,
      status: 'pending',
    });

    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ message: 'Erreur de création', error: err.message });
  }
};

// ── PUT /api/listings/:id — Modifier son annonce ──
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }
    if (listing.seller.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres annonces' });
    }

    const { title, description, price, category, condition, location } = req.body;
    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = Number(price);
    if (category) listing.category = category;
    if (condition) listing.condition = condition;
    if (location !== undefined) listing.location = location;

    // Upload new images if provided
    if (req.files?.images) {
      for (const imageFile of req.files.images) {
        const imgResult = await uploadToCloudinary(imageFile.buffer, {
          resource_type: 'image',
          folder: 'techpulse/listings/images',
          transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
        });
        listing.images.push({ url: imgResult.secure_url, publicId: imgResult.public_id });
      }
    }

    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(400).json({ message: 'Erreur de mise à jour', error: err.message });
  }
};

// ── DELETE /api/listings/:id — Supprimer son annonce ──
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }
    if (listing.seller.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    // Clean up Cloudinary files
    if (listing.video?.publicId) {
      await cloudinary.uploader.destroy(listing.video.publicId, { resource_type: 'video' });
    }
    for (const img of listing.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Annonce supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── PATCH /api/listings/:id/verify — Admin: vérifier annonce ──
export const verifyListing = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide (active ou rejected)' });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        status,
        videoVerified: status === 'active',
      },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};