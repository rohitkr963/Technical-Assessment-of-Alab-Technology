import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

export function useCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const runAction = useCallback(async (action, successMessage) => {
    try {
      await action();
      setNotice(successMessage);
      await refresh();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  }, [refresh]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((product) => product.status === 'Active').length,
    lowStock: products.filter((product) => product.stock < 10).length,
    categories: categories.length
  }), [products, categories]);

  return {
    products,
    categories,
    loading,
    error,
    notice,
    stats,
    setError,
    refresh,
    runAction
  };
}
