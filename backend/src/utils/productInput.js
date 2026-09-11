export function normalizeProductInput(body, file) {
  const product = {
    ...body,
    price: Number(body.price),
    stock: Number(body.stock),
    featured: body.featured === true || body.featured === 'true',
    returnable: body.returnable === true || body.returnable === 'true'
  };

  // Keep the database value relative to the API so it works behind a proxy too.
  if (file) {
    product.imageUrl = `/uploads/${file.filename}`;
  }

  return product;
}
