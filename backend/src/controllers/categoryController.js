import Category from '../models/Category.js';
import Product from '../models/Product.js';

const slugify = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

export async function listCategories(req, res, next) {
  try {
    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .lean();
    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const countMap = Object.fromEntries(counts.map((item) => [String(item._id), item.count]));
    const data = categories.map((category) => ({
      ...category,
      productCount: countMap[String(category._id)] || 0
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, description = '', status = 'Active' } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Category name is required' });
    const category = await Category.create({ name: name.trim(), slug: slugify(name), description, status });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const updates = { ...req.body };
    if (updates.name) {
      updates.name = updates.name.trim();
      updates.slug = slugify(updates.name);
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    // A category cannot be removed while products still point to it.
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount) return res.status(409).json({ success: false, message: 'Move or delete products before deleting this category' });
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
}
