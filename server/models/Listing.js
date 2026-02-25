import mongoose from 'mongoose';
import slugify from 'slugify';

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      minlength: 10,
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [1, 'Le prix minimum est 1€'],
    },
    category: {
      type: String,
      required: [true, 'La catégorie est requise'],
      enum: ['Smartphone', 'Laptop', 'Wearable', 'Accessoire'],
    },
    condition: {
      type: String,
      required: [true, 'L\'état est requis'],
      enum: ['Comme neuf', 'Très bon état', 'Bon état', 'État correct'],
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    video: {
      url: {
        type: String,
        required: [true, 'La vidéo de vérification est obligatoire'],
      },
      publicId: String,
      duration: Number,
    },
    videoVerified: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'pending', 'rejected'],
      default: 'pending',
    },
    location: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// ── Auto-generate slug ──
listingSchema.pre('save', async function () {
  if (this.isModified('title')) {
    const base = slugify(this.title, { lower: true, strict: true });
    const random = Math.random().toString(36).substring(2, 7);
    this.slug = `${base}-${random}`;
  }
});

export default mongoose.model('Listing', listingSchema);