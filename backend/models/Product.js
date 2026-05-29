import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    description:   { type: String, required: true },
    specifications:{ type: Map, of: String, default: {} },
    price:         { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    category:      { type: String, required: true, trim: true },
    brand:         { type: String, trim: true },
    images:        [{ type: String }],
    stock:         { type: Number, required: true, default: 0 },
    ratings:       { type: Number, default: 0 },
    numReviews:    { type: Number, default: 0 },
    reviews:       [reviewSchema],
    isFeatured:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
