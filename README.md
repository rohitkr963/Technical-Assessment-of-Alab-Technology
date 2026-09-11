# Alab Catalog

A full-stack MERN product and category management assessment.

## Requirements

- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## Run

```bash
npm run install:all
copy backend\\.env.example backend\\.env
npm run dev
```

Open `http://localhost:5173`. The REST API runs at `http://localhost:5000/api`.

## API

- `GET|POST /api/categories`
- `PUT|DELETE /api/categories/:id`
- `GET|POST /api/products`
- `GET|PUT|DELETE /api/products/:id`
- `PATCH /api/products/:id/status`

Product creation uses `multipart/form-data` with an optional `image` field. Category deletion is guarded when products still reference it.

## Project layout

```text
backend/
	src/controllers/   Request handlers for products and categories
	src/models/        Mongoose schemas and the product-category reference
	src/routes/        API route definitions
	src/utils/         Small pieces of request/data normalization
	test/              Node test runner checks for backend behavior
frontend/
	src/components/    Tables, forms, feedback, and detail views
	src/hooks/         Catalog loading and mutation state
	src/pages/         Page-specific code can be added here as the app grows
	src/services/      HTTP client used by the React components
```

The frontend keeps API calls in `services/api.js` and catalog state in `hooks/useCatalog.js`. The backend keeps relationship rules close to the controller that owns them; for example, a category with products cannot be deleted accidentally.

## Checks

```bash
npm test --prefix backend
npm run build --prefix frontend
```
