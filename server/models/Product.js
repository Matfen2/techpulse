import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est requis'],
      unique: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
    },
    brand: {
      type: String,
      required: [true, 'La marque est requise'],
      enum: ['Samsung', 'Xiaomi', 'Asus', 'Sony', 'Apple', 'Lenovo'],
    },
    category: {
      type: String,
      required: [true, 'La catégorie est requise'],
      enum: ['Smartphone', 'Laptop', 'Wearable', 'Accessoire'],
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      minlength: 10,
    },
    specs: {
      type: Object,
      default: {},
    },
    image: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ── Auto-generate slug before save ──
productSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

// ── Also generate slug on update ──
productSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
});

export default mongoose.model('Product', productSchema);