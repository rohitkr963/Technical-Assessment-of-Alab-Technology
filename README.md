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
