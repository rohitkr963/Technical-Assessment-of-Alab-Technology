import { X } from 'lucide-react';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function ProductDetailModal({ product, onClose }) {
  return <div className="modal-backdrop"><div className="modal detail-modal">
    <button className="close-button" onClick={onClose} aria-label="Close details"><X size={19} /></button>
    <p className="eyebrow">PRODUCT DETAILS</p><h2>{product.name}</h2><p className="muted">{product.sku} · {product.category?.name || 'Uncategorized'}</p>
    <div className="detail-grid"><Detail label="Price" value={currency.format(product.price)} /><Detail label="Stock" value={`${product.stock} units`} /><Detail label="Brand" value={product.brand || 'Not set'} /><Detail label="Availability" value={product.availability} /></div>
    <p className="detail-description">{product.description || 'No description provided.'}</p>
  </div></div>;
}

function Detail({ label, value }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
