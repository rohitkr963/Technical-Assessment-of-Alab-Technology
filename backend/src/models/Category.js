import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true, minlength: 2 },
  slug: { type: String, required: true, trim: true, unique: true },
  description: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
