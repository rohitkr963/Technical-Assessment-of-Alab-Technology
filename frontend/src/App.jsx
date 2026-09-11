import { useEffect, useMemo, useState } from 'react';
import {
  Archive, ArrowUpRight, BarChart3, Check, CirclePlus, Edit3,
  ImagePlus, LayoutGrid, MoreHorizontal, Package, PanelLeft, Search,
  Settings2, Tag, Trash2, X
} from 'lucide-react';
import { api } from './services/api';

const emptyProduct = {
  name: '', sku: '', description: '', price: '', stock: '', category: '',
  brand: '', productType: 'Physical', availability: 'In stock',
  featured: false, returnable: true, availableFrom: '', expiryDate: '',
  status: 'Active', image: null
};

const emptyCategory = { name: '', description: '', status: 'Active' };
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const filesBase = apiBase.replace(/\/api$/, '');

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState('products');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadCatalog() {
    setLoading(true);
    try {
      const [productList, categoryList] = await Promise.all([
        api.products.list(),
        api.categories.list()
      ]);
      setProducts(productList);
      setCategories(categoryList);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCatalog(); }, []);

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(''), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const text = `${product.name} ${product.sku} ${product.brand}`.toLowerCase();
    return text.includes(search.toLowerCase()) &&
      (status === 'All' || product.status === status);
  }), [products, search, status]);

  const stats = {
    total: products.length,
    active: products.filter((product) => product.status === 'Active').length,
    lowStock: products.filter((product) => product.stock < 10).length,
    categoryCount: categories.length
  };

  function openProduct(product = null) {
    setForm(product ? {
      ...emptyProduct,
      ...product,
      category: product.category?._id || product.category || '',
      availableFrom: product.availableFrom?.slice(0, 10) || '',
      expiryDate: product.expiryDate?.slice(0, 10) || '',
      image: null
    } : { ...emptyProduct, category: categories[0]?._id || '' });
    setDialog({ type: 'product', item: product });
  }

  function openCategory(category = null) {
    setForm(category ? {
      name: category.name,
      description: category.description,
      status: category.status
    } : { ...emptyCategory });
    setDialog({ type: 'category', item: category });
  }

  async function save(event) {
    event.preventDefault();
    try {
      if (dialog.type === 'product') {
        const data = new FormData();
        Object.entries(form)
          .filter(([key]) => key !== 'image')
          .forEach(([key, value]) => data.append(key, value ?? ''));
        if (form.image) data.append('image', form.image);
        await api.products.save(data, dialog.item?._id);
      } else {
        await api.categories.save({
          name: form.name,
          description: form.description,
          status: form.status
        }, dialog.item?._id);
      }
      setDialog(null);
      setMessage(`${dialog.type === 'product' ? 'Product' : 'Category'} saved successfully`);
      await loadCatalog();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function remove(type, item) {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    try {
      if (type === 'product') await api.products.remove(item._id);
      else await api.categories.remove(item._id);
      setMessage(`${type === 'product' ? 'Product' : 'Category'} deleted`);
      await loadCatalog();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function changeStatus(type, item) {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    try {
      if (type === 'product') await api.products.status(item._id, nextStatus);
      else await api.categories.save({ status: nextStatus }, item._id);
      setMessage(`${type === 'product' ? 'Product' : 'Category'} status updated`);
      await loadCatalog();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const showingProducts = page === 'products';
  return <div className="app-shell">
    <Sidebar page={page} count={products.length} onChange={setPage} />
    <main className="main-content">
      <header className="topbar">
        <button className="mobile-menu" aria-label="Open menu"><PanelLeft size={20} /></button>
        <div className="breadcrumb">Workspace <span>/</span> {showingProducts ? 'Products' : 'Categories'}</div>
        <div className="top-actions"><span className="live-dot" /> Connected <Search size={18} /></div>
      </header>

      <section className="page-header">
        <div><p className="eyebrow">CATALOG MANAGEMENT</p><h1>{showingProducts ? 'Products' : 'Categories'}</h1><p className="subtitle">{showingProducts ? 'Manage your catalog, inventory, and product visibility.' : 'Organize products into useful collections.'}</p></div>
        <button className="primary-button" onClick={() => showingProducts ? openProduct() : openCategory()}><CirclePlus size={17} /> Add {showingProducts ? 'product' : 'category'}</button>
      </section>

      {error && <div className="alert error"><X size={17} />{error}<button onClick={() => setError('')}><X size={15} /></button></div>}
      {message && <div className="alert success"><Check size={17} />{message}</div>}

      {showingProducts ? <>
        <Stats stats={stats} />
        <section className="toolbar"><div className="search-box"><Search size={17} /><input placeholder="Search by product, SKU, or brand..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Active</option><option>Inactive</option></select></section>
        <ProductTable products={visibleProducts} loading={loading} onEdit={openProduct} onDelete={(item) => remove('product', item)} onStatus={(item) => changeStatus('product', item)} onView={(item) => setDialog({ type: 'detail', item })} />
      </> : <CategoryTable categories={categories} loading={loading} onEdit={openCategory} onDelete={(item) => remove('category', item)} onStatus={(item) => changeStatus('category', item)} />}
    </main>

    {dialog?.type === 'detail' && <ProductDetails product={dialog.item} onClose={() => setDialog(null)} />}
    {(dialog?.type === 'product' || dialog?.type === 'category') && <CatalogForm type={dialog.type} item={dialog.item} form={form} setForm={setForm} categories={categories} onSave={save} onClose={() => setDialog(null)} />}
  </div>;
}

function Sidebar({ page, count, onChange }) {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark">A</span><span>alab<span className="brand-dot">.</span></span></div><div className="workspace-label">WORKSPACE</div><nav><button className="nav-item active"><LayoutGrid size={17} /> Overview</button><button className={`nav-item ${page === 'products' ? 'selected' : ''}`} onClick={() => onChange('products')}><Package size={17} /> Products <span className="nav-count">{count}</span></button><button className={`nav-item ${page === 'categories' ? 'selected' : ''}`} onClick={() => onChange('categories')}><Tag size={17} /> Categories</button><button className="nav-item"><BarChart3 size={17} /> Analytics</button></nav><div className="sidebar-bottom"><button className="nav-item"><Settings2 size={17} /> Settings</button><div className="user-chip"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><small>Administrator</small></div><MoreHorizontal size={17} /></div></div></aside>;
}

function Stats({ stats }) {
  const cards = [[Package, 'Total products', stats.total, 'ink'], [Check, 'Active products', stats.active, 'mint'], [Archive, 'Low stock', stats.lowStock, 'amber'], [Tag, 'Categories', stats.categoryCount, 'coral']];
  return <section className="stats-grid">{cards.map(([Icon, label, value, color]) => <div className={`stat-card ${color}`} key={label}><div className="stat-icon"><Icon /></div><div><span>{label}</span><strong>{value}</strong></div></div>)}</section>;
}

function ProductTable({ products, loading, onEdit, onDelete, onStatus, onView }) {
  if (loading) return <section className="table-card"><div className="empty-state">Loading catalog...</div></section>;
  if (!products.length) return <section className="table-card"><div className="empty-state"><Package size={32} /><strong>No products found</strong><span>Try another search or add a product.</span></div></section>;
  return <section className="table-card"><div className="table-head"><div><h2>All products</h2><span>{products.length} records</span></div><LayoutGrid size={16} /></div><div className="table-wrap"><table><thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>STATUS</th><th /></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><div className="product-cell">{product.imageUrl ? <img src={`${filesBase}${product.imageUrl}`} alt="" /> : <div className="product-placeholder"><Package size={17} /></div>}<div><strong>{product.name}</strong><small>{product.brand || 'No brand'}</small></div></div></td><td className="muted mono">{product.sku}</td><td>{product.category?.name || 'Uncategorized'}</td><td className="price">{currency.format(product.price)}</td><td><span className={product.stock < 10 ? 'stock low' : 'stock'}>{product.stock} units</span></td><td><button className={`status ${product.status.toLowerCase()}`} onClick={() => onStatus(product)}><span />{product.status}</button></td><td><div className="row-actions"><button title="View" onClick={() => onView(product)}><ArrowUpRight size={16} /></button><button title="Edit" onClick={() => onEdit(product)}><Edit3 size={16} /></button><button title="Delete" onClick={() => onDelete(product)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></section>;
}

function CategoryTable({ categories, loading, onEdit, onDelete, onStatus }) {
  if (loading) return <section className="table-card"><div className="empty-state">Loading categories...</div></section>;
  return <section className="table-card"><div className="table-head"><div><h2>All categories</h2><span>{categories.length} collections</span></div></div>{!categories.length ? <div className="empty-state"><Tag size={32} /><strong>No categories yet</strong><span>Create a category to organize products.</span></div> : <div className="table-wrap"><table><thead><tr><th>CATEGORY</th><th>DESCRIPTION</th><th>PRODUCTS</th><th>STATUS</th><th /></tr></thead><tbody>{categories.map((category) => <tr key={category._id}><td><div className="category-cell"><span className="category-icon"><Tag size={16} /></span><strong>{category.name}</strong></div></td><td className="muted">{category.description || 'No description'}</td><td>{category.productCount} products</td><td><button className={`status ${category.status.toLowerCase()}`} onClick={() => onStatus(category)}><span />{category.status}</button></td><td><div className="row-actions"><button title="Edit" onClick={() => onEdit(category)}><Edit3 size={16} /></button><button title="Delete" onClick={() => onDelete(category)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}</section>;
}

function ProductDetails({ product, onClose }) {
  return <div className="modal-backdrop"><div className="modal detail-modal"><button className="close-button" onClick={onClose}><X size={19} /></button><p className="eyebrow">PRODUCT DETAILS</p><h2>{product.name}</h2><p className="muted">{product.sku} · {product.category?.name || 'Uncategorized'}</p><div className="detail-grid"><div><span>Price</span><strong>{currency.format(product.price)}</strong></div><div><span>Stock</span><strong>{product.stock} units</strong></div><div><span>Brand</span><strong>{product.brand || 'Not set'}</strong></div><div><span>Availability</span><strong>{product.availability}</strong></div></div><p className="detail-description">{product.description || 'No description provided.'}</p></div></div>;
}

function CatalogForm({ type, item, form, setForm, categories, onSave, onClose }) {
  const product = type === 'product';
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const input = (label, key, options = {}) => <label>{label}<input {...options} value={form[key]} onChange={(event) => update(key, event.target.value)} /></label>;
  return <div className="modal-backdrop"><form className="modal form-modal" onSubmit={onSave}><button type="button" className="close-button" onClick={onClose}><X size={19} /></button><p className="eyebrow">{item ? 'EDIT' : 'NEW'} {product ? 'PRODUCT' : 'CATEGORY'}</p><h2>{item ? 'Update' : 'Create'} {product ? 'product' : 'category'}</h2><div className="form-grid">{product ? <><>{input('Product name', 'name', { required: true })}</><>{input('SKU', 'sku', { required: true })}</><label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label><label>Category<select required value={form.category} onChange={(event) => update('category', event.target.value)}><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label><>{input('Price', 'price', { required: true, type: 'number', min: 0, step: '0.01' })}</><>{input('Stock', 'stock', { required: true, type: 'number', min: 0 })}</><>{input('Brand', 'brand')}</><Select label="Product type" value={form.productType} values={['Physical', 'Digital', 'Service']} onChange={(event) => update('productType', event.target.value)} /><Select label="Availability" value={form.availability} values={['In stock', 'Pre-order', 'Backorder']} onChange={(event) => update('availability', event.target.value)} /><>{input('Available from', 'availableFrom', { type: 'date' })}</><>{input('Expiry date', 'expiryDate', { type: 'date' })}</><label className="file-field">Product image<div><ImagePlus size={17} />{form.image?.name || 'Choose image'}<input type="file" accept="image/*" onChange={(event) => update('image', event.target.files?.[0] || null)} /></div></label><div className="checks"><label className="check"><input type="checkbox" checked={form.featured} onChange={(event) => update('featured', event.target.checked)} /> Featured</label><label className="check"><input type="checkbox" checked={form.returnable} onChange={(event) => update('returnable', event.target.checked)} /> Returnable</label></div></> : <><>{input('Category name', 'name', { required: true })}</><label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label><Select label="Status" value={form.status} values={['Active', 'Inactive']} onChange={(event) => update('status', event.target.value)} /></>}</div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit"><Check size={17} /> Save</button></div></form></div>;
}

function Select({ label, values, ...props }) { return <label>{label}<select {...props}>{values.map((value) => <option key={value}>{value}</option>)}</select></label>; }
