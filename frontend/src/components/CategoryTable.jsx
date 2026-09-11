import { Edit3, Tag, Trash2 } from 'lucide-react';

export function CategoryTable({ categories, loading, onEdit, onDelete, onToggleStatus }) {
  return <section className="table-card"><div className="table-head"><div><h2>All categories</h2><span>{categories.length} collections</span></div></div>
    {loading ? <div className="empty-state">Loading categories...</div> : categories.length === 0 ? <div className="empty-state"><Tag size={32} /><strong>No categories yet</strong><span>Create a category to organize your products.</span></div> : <div className="table-wrap"><table><thead><tr><th>CATEGORY</th><th>DESCRIPTION</th><th>PRODUCTS</th><th>STATUS</th><th /></tr></thead><tbody>
      {categories.map((category) => <tr key={category._id}><td><div className="category-cell"><span className="category-icon"><Tag size={16} /></span><strong>{category.name}</strong></div></td><td className="muted">{category.description || 'No description'}</td><td>{category.productCount} products</td><td><button className={`status ${category.status.toLowerCase()}`} onClick={() => onToggleStatus(category)}><span />{category.status}</button></td><td><div className="row-actions"><button title="Edit" onClick={() => onEdit(category)}><Edit3 size={16} /></button><button title="Delete" onClick={() => onDelete(category)}><Trash2 size={16} /></button></div></td></tr>)}
    </tbody></table></div>}
  </section>;
}
