import { ArrowUpRight, Edit3, LayoutGrid, Package, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const FILES_URL = API_URL.replace(/\/api$/, '');
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onView
}) {
  return (
    <section className="table-card">
      <div className="table-head">
        <div>
          <h2>All products</h2>
          <span>{products.length} records</span>
        </div>
        <button className="view-toggle active" aria-label="Table view">
          <LayoutGrid size={16} />
        </button>
      </div>

      {loading && <div className="empty-state">Loading catalog...</div>}

      {!loading && products.length === 0 && (
        <div className="empty-state">
          <Package size={32} />
          <strong>No products found</strong>
          <span>Try another search or add your first product.</span>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                  onView={onView}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ProductRow({ product, onEdit, onDelete, onToggleStatus, onView }) {
  const imageUrl = product.imageUrl ? `${FILES_URL}${product.imageUrl}` : null;
  const stockClassName = product.stock < 10 ? 'stock low' : 'stock';
  const statusClassName = `status ${product.status.toLowerCase()}`;

  return (
    <tr>
      <td>
        <div className="product-cell">
          {imageUrl ? (
            <img src={imageUrl} alt="" />
          ) : (
            <div className="product-placeholder">
              <Package size={17} />
            </div>
          )}
          <div>
            <strong>{product.name}</strong>
            <small>{product.brand || 'No brand'}</small>
          </div>
        </div>
      </td>
      <td className="muted mono">{product.sku}</td>
      <td>{product.category?.name || 'Uncategorized'}</td>
      <td className="price">{currency.format(product.price)}</td>
      <td><span className={stockClassName}>{product.stock} units</span></td>
      <td>
        <button className={statusClassName} onClick={() => onToggleStatus(product)}>
          <span />
          {product.status}
        </button>
      </td>
      <td>
        <div className="row-actions">
          <button title="View" onClick={() => onView(product)}>
            <ArrowUpRight size={16} />
          </button>
          <button title="Edit" onClick={() => onEdit(product)}>
            <Edit3 size={16} />
          </button>
          <button title="Delete" onClick={() => onDelete(product)}>
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
