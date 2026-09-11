import { useMemo, useState } from 'react';
import { BarChart3, Check, CirclePlus, LayoutGrid, MoreHorizontal, Package, PanelLeft, Search, Settings2, Tag } from 'lucide-react';
import { CatalogFormModal } from './components/CatalogFormModal';
import { CatalogStats } from './components/CatalogStats';
import { CategoryTable } from './components/CategoryTable';
import { Feedback } from './components/Feedback';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductTable } from './components/ProductTable';
import { EMPTY_CATEGORY, EMPTY_PRODUCT, PRODUCT_STATUSES } from './constants/catalog';
import { useCatalog } from './hooks/useCatalog';
import { api } from './services/api';

export default function App() {
  const catalog = useCatalog();
  const [section, setSection] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);

  const filteredProducts = useMemo(() => catalog.products.filter((product) => {
    const searchableText = `${product.name} ${product.sku} ${product.brand}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [catalog.products, searchTerm, statusFilter]);

  const openProductForm = (product = null) => {
    setForm(product ? {
      ...EMPTY_PRODUCT,
      ...product,
      category: product.category?._id || product.category || '',
      availableFrom: product.availableFrom?.slice(0, 10) || '',
      expiryDate: product.expiryDate?.slice(0, 10) || '',
      image: null
    } : { ...EMPTY_PRODUCT, category: catalog.categories[0]?._id || '' });
    setModal({ type: 'product', item: product });
  };

  const openCategoryForm = (category = null) => {
    setForm(category ? { name: category.name, description: category.description, status: category.status } : EMPTY_CATEGORY);
    setModal({ type: 'category', item: category });
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    const currentModal = modal;
    const productId = currentModal.item?._id;
    const categoryId = currentModal.item?._id;
    const save = currentModal.type === 'product'
      ? () => api.products.save(toProductPayload(form), productId)
      : () => api.categories.save({ name: form.name, description: form.description, status: form.status }, categoryId);
    const label = currentModal.type === 'product' ? 'Product' : 'Category';
    const saved = await catalog.runAction(save, `${label} ${currentModal.item ? 'updated' : 'created'} successfully`);
    if (saved) setModal(null);
  };

  const removeRecord = (type, item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    const remove = type === 'product' ? () => api.products.remove(item._id) : () => api.categories.remove(item._id);
    catalog.runAction(remove, `${type === 'product' ? 'Product' : 'Category'} deleted`);
  };

  const toggleProductStatus = (product) => catalog.runAction(
    () => api.products.status(product._id, product.status === 'Active' ? 'Inactive' : 'Active'),
    'Product status updated'
  );

  const toggleCategoryStatus = (category) => catalog.runAction(
    () => api.categories.save({ status: category.status === 'Active' ? 'Inactive' : 'Active' }, category._id),
    'Category status updated'
  );

  const isProducts = section === 'products';
  return <div className="app-shell">
    <Sidebar section={section} productCount={catalog.products.length} onNavigate={setSection} />
    <main className="main-content">
      <Header section={section} />
      <PageHeader isProducts={isProducts} onAdd={() => isProducts ? openProductForm() : openCategoryForm()} />
      <Feedback error={catalog.error} notice={catalog.notice} onDismissError={() => catalog.setError('')} />
      {isProducts ? <ProductSection products={filteredProducts} stats={catalog.stats} loading={catalog.loading} searchTerm={searchTerm} statusFilter={statusFilter} onSearch={setSearchTerm} onStatusFilter={setStatusFilter} onEdit={openProductForm} onDelete={(item) => removeRecord('product', item)} onToggleStatus={toggleProductStatus} onView={(product) => setModal({ type: 'detail', item: product })} /> : <CategoryTable categories={catalog.categories} loading={catalog.loading} onEdit={openCategoryForm} onDelete={(item) => removeRecord('category', item)} onToggleStatus={toggleCategoryStatus} />}
    </main>
    {modal?.type === 'detail' && <ProductDetailModal product={modal.item} onClose={() => setModal(null)} />}
    {(modal?.type === 'product' || modal?.type === 'category') && <CatalogFormModal type={modal.type} item={modal.item} form={form} setForm={setForm} categories={catalog.categories} onSubmit={saveRecord} onClose={() => setModal(null)} />}
  </div>;
}

function toProductPayload(form) {
  const payload = new FormData();
  Object.entries(form).filter(([key]) => key !== 'image').forEach(([key, value]) => payload.append(key, value ?? ''));
  if (form.image) payload.append('image', form.image);
  return payload;
}

function Sidebar({ section, productCount, onNavigate }) {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark">A</span><span>alab<span className="brand-dot">.</span></span></div><div className="workspace-label">WORKSPACE</div><nav><button className="nav-item active"><LayoutGrid size={17} /> Overview</button><button className={`nav-item ${section === 'products' ? 'selected' : ''}`} onClick={() => onNavigate('products')}><Package size={17} /> Products <span className="nav-count">{productCount}</span></button><button className={`nav-item ${section === 'categories' ? 'selected' : ''}`} onClick={() => onNavigate('categories')}><Tag size={17} /> Categories</button><button className="nav-item"><BarChart3 size={17} /> Analytics</button></nav><div className="sidebar-bottom"><button className="nav-item"><Settings2 size={17} /> Settings</button><div className="user-chip"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><small>Administrator</small></div><MoreHorizontal size={17} /></div></div></aside>;
}

function Header({ section }) { return <header className="topbar"><button className="mobile-menu" aria-label="Open menu"><PanelLeft size={20} /></button><div className="breadcrumb">Workspace <span>/</span> {section === 'products' ? 'Products' : 'Categories'}</div><div className="top-actions"><span className="live-dot" /> Connected <button className="icon-button" aria-label="Search"><Search size={18} /></button></div></header>; }
function PageHeader({ isProducts, onAdd }) { return <section className="page-header"><div><p className="eyebrow">CATALOG MANAGEMENT</p><h1>{isProducts ? 'Products' : 'Categories'}</h1><p className="subtitle">{isProducts ? 'Manage your catalog, inventory, and product visibility.' : 'Organize products into clear, useful collections.'}</p></div><button className="primary-button" onClick={onAdd}><CirclePlus size={17} /> Add {isProducts ? 'product' : 'category'}</button></section>; }
function ProductSection({ products, stats, loading, searchTerm, statusFilter, onSearch, onStatusFilter, ...tableActions }) { return <><CatalogStats stats={stats} /><section className="toolbar"><div className="search-box"><Search size={17} /><input placeholder="Search by product, SKU, or brand..." value={searchTerm} onChange={(event) => onSearch(event.target.value)} /></div><div className="toolbar-actions"><select value={statusFilter} onChange={(event) => onStatusFilter(event.target.value)}>{PRODUCT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select><button className="filter-button"><Check size={15} /> Status</button></div></section><ProductTable products={products} loading={loading} {...tableActions} /></>; }
