const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Request failed');
  return payload.data;
}

export const api = {
  products: {
    list: () => request('/products'),
    get: (id) => request(`/products/${id}`),
    save: (data, id) => request(id ? `/products/${id}` : '/products', { method: id ? 'PUT' : 'POST', body: data }),
    remove: (id) => request(`/products/${id}`, { method: 'DELETE' }),
    status: (id, status) => request(`/products/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
  },
  categories: {
    list: () => request('/categories'),
    save: (data, id) => request(id ? `/categories/${id}` : '/categories', { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    remove: (id) => request(`/categories/${id}`, { method: 'DELETE' })
  }
};
