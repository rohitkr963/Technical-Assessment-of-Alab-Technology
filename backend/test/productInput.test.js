import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProductInput } from '../src/utils/productInput.js';

test('normalizes values submitted by the product form', () => {
  const product = normalizeProductInput({
    name: 'Desk Lamp',
    price: '39.95',
    stock: '12',
    featured: 'true',
    returnable: 'false'
  });

  assert.equal(product.price, 39.95);
  assert.equal(product.stock, 12);
  assert.equal(product.featured, true);
  assert.equal(product.returnable, false);
  assert.equal(product.imageUrl, undefined);
});

test('stores an uploaded image as a relative reference', () => {
  const product = normalizeProductInput({}, { filename: 'lamp.png' });

  assert.equal(product.imageUrl, '/uploads/lamp.png');
});
