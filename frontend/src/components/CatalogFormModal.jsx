import { Check, ImagePlus, X } from 'lucide-react';

export function CatalogFormModal({ type, item, form, setForm, categories, onSubmit, onClose }) {
  const isProduct = type === 'product';
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return <div className="modal-backdrop"><form className="modal form-modal" onSubmit={onSubmit}>
    <button type="button" className="close-button" onClick={onClose} aria-label="Close form"><X size={19} /></button>
    <p className="eyebrow">{item ? 'EDIT' : 'NEW'} {isProduct ? 'PRODUCT' : 'CATEGORY'}</p>
    <h2>{item ? 'Update' : 'Create'} {isProduct ? 'product' : 'category'}</h2>
    <div className="form-grid">{isProduct ? <ProductFields form={form} update={update} categories={categories} /> : <CategoryFields form={form} update={update} />}</div>
    <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit"><Check size={17} />{item ? 'Save changes' : `Create ${isProduct ? 'product' : 'category'}`}</button></div>
  </form></div>;
}

function ProductFields({ form, update, categories }) {
  return <>
    <Field label="Product name" required value={form.name} onChange={(event) => update('name', event.target.value)} />
    <Field label="SKU" required value={form.sku} onChange={(event) => update('sku', event.target.value)} />
    <label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
    <label>Category<select required value={form.category} onChange={(event) => update('category', event.target.value)}><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label>
    <Field label="Price" required min="0" step="0.01" type="number" value={form.price} onChange={(event) => update('price', event.target.value)} />
    <Field label="Stock" required min="0" type="number" value={form.stock} onChange={(event) => update('stock', event.target.value)} />
    <Field label="Brand" value={form.brand} onChange={(event) => update('brand', event.target.value)} />
    <SelectField label="Product type" value={form.productType} options={['Physical', 'Digital', 'Service']} onChange={(event) => update('productType', event.target.value)} />
    <SelectField label="Availability" value={form.availability} options={['In stock', 'Pre-order', 'Backorder']} onChange={(event) => update('availability', event.target.value)} />
    <Field label="Available from" type="date" value={form.availableFrom} onChange={(event) => update('availableFrom', event.target.value)} />
    <Field label="Expiry date" type="date" value={form.expiryDate} onChange={(event) => update('expiryDate', event.target.value)} />
    <label className="file-field">Product image<div><ImagePlus size={17} />{form.image?.name || 'Choose image'}<input type="file" accept="image/*" onChange={(event) => update('image', event.target.files?.[0] || null)} /></div></label>
    <div className="checks"><label className="check"><input type="checkbox" checked={form.featured} onChange={(event) => update('featured', event.target.checked)} /> Featured</label><label className="check"><input type="checkbox" checked={form.returnable} onChange={(event) => update('returnable', event.target.checked)} /> Returnable</label></div>
  </>;
}

function CategoryFields({ form, update }) {
  return <><Field label="Category name" required value={form.name} onChange={(event) => update('name', event.target.value)} /><label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label><SelectField label="Status" value={form.status} options={['Active', 'Inactive']} onChange={(event) => update('status', event.target.value)} /></>;
}

function Field({ label, ...props }) { return <label>{label}<input {...props} /></label>; }
function SelectField({ label, options, ...props }) { return <label>{label}<select {...props}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
