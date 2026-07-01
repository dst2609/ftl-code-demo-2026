# Student Store UI

React + Vite frontend for the College of CodePath Student Store. It talks to the
backend in [`../api`](../api).

## Setup

```bash
npm install
npm run dev
```

The app runs on http://localhost:5173 and expects the API on
http://localhost:3000 (start the API first — see `../api/README.md`).

## What it does

- Browses products from `GET /products`
- Manages a shopping cart client-side
- Places an order via `POST /orders` (sends `{ order: { customer_id, status }, items: [...] }`)
- Login / signup via `/auth/login` and `/auth/register` — you must be signed in to check out

> Products expose `image_url` and `price` (in cents); the UI divides price by 100
> for display.
