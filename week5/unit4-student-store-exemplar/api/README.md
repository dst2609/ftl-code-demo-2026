# Student Store API

Backend API and Prisma-managed PostgreSQL database for the College of CodePath Student Store.

Built with **Node + Express** and **Prisma** over **PostgreSQL**. The full system spec (data models, API contract, and transactional flow) lives in [planning.md](./planning.md).

## Tech Stack

- Node + Express
- Prisma ORM
- PostgreSQL
- JWT + bcrypt (auth endpoints)

## Dev Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create your `.env`** from the template and edit the values (especially `DATABASE_URL`):

   ```bash
   cp .env.example .env
   ```

3. **Create the database** (PostgreSQL must be running). The database name must match the one in your `DATABASE_URL`:

   ```bash
   createdb student_store
   ```

4. **Run the migrations** to create the tables from `prisma/schema.prisma`:

   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database** with the default products and a demo user:

   ```bash
   npm run seed
   ```

6. **Start the server** (defaults to http://localhost:3000):

   ```bash
   npm start
   ```

## Useful Commands

| Command | What it does |
| --- | --- |
| `npm start` | Start the API with nodemon |
| `npm run migrate` | Run `prisma migrate dev` |
| `npm run generate` | Regenerate the Prisma Client |
| `npm run seed` | Seed the database |
| `npm run studio` | Open Prisma Studio (visual DB browser) |

## API Endpoints

See [planning.md](./planning.md) for the full request/response contract. In short:

**Products**
- `GET /products` — list all products (supports `?category=` and `?sort=price|name`)
- `GET /products/:id` — one product
- `POST /products` — create
- `PUT /products/:id` — update
- `DELETE /products/:id` — delete (cascades to its order items)

**Orders**
- `GET /orders` — list all orders (supports `?email=` filter)
- `GET /orders/:order_id` — one order, including its items
- `POST /orders` — create an order and its items atomically
- `PUT /orders/:order_id` — update an order (e.g. status)
- `DELETE /orders/:order_id` — delete (cascades to its order items)
- `POST /orders/:order_id/items` — add an item to an existing order *(stretch)*

**Order Items**
- `GET /order-items` — list every order item *(stretch)*

**Auth**
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`

## Notes

- **Prices are stored in cents** (integers) to avoid floating-point currency errors. The frontend divides by 100 for display.
- **Error shape** is consistent across the API: `{ "error": { "message": "...", "status": 400 } }`.
