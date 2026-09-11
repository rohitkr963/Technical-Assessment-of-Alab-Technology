import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  sku: { type: String, required: true, trim: true, uppercase: true, unique: true },
  description: { type: String, trim: true, default: '' },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, trim: true, default: '' },
  productType: { type: String, enum: ['Physical', 'Digital', 'Service'], default: 'Physical' },
  availability: { type: String, enum: ['In stock', 'Pre-order', 'Backorder'], default: 'In stock' },
  featured: { type: Boolean, default: false },
  returnable: { type: Boolean, default: true },
  availableFrom: { type: Date },
  expiryDate: { type: Date },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
