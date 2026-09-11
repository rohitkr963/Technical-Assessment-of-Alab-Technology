import Product from '../models/Product.js';

const cleanBody = (body, file) => ({
  ...body,
  price: Number(body.price),
  stock: Number(body.stock),
  featured: body.featured === true || body.featured === 'true',
  returnable: body.returnable === true || body.returnable === 'true',
  ...(file ? { imageUrl: `/uploads/${file.filename}` } : {})
});

export async function listProducts(req, res, next) {
  try {
    const filter = req.query.status && req.query.status !== 'All' ? { status: req.query.status } : {};
    const products = await Product.find(filter).populate('category', 'name').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: products });
  } catch (error) { next(error); }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name description');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) { next(error); }
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(cleanBody(req.body, req.file));
    await product.populate('category', 'name');
    res.status(201).json({ success: true, data: product });
  } catch (error) { next(error); }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, cleanBody(req.body, req.file), { new: true, runValidators: true }).populate('category', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) { next(error); }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) { next(error); }
}

export async function updateProductStatus(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }).populate('category', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) { next(error); }
}
