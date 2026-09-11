-- MongoDB schema reference for the Alab product catalog.
-- Category has many Product documents through Product.category.
-- See backend/src/models for the runtime Mongoose schema.

-- categories: { name, slug, description, status, createdAt, updatedAt }
-- products: { name, sku, description, price, stock, category, brand,
--             productType, availability, featured, returnable,
--             availableFrom, expiryDate, imageUrl, status, createdAt, updatedAt }
