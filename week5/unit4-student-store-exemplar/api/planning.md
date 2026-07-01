# Student Store — System Spec (planning.md)

This document is the source of truth for the Student Store backend. It was
written **before** any schema or route code and is the reference for every
milestone that follows. It has three core sections — **Data Models**, **API
Contract**, and **Transactional Flow** — followed by the running Decisions Logs
and Spec Reconciliation notes added during implementation.

> **Currency note:** all prices (`Product.price`, `OrderItem.price`,
> `Order.total_price`) are stored as **integers in cents**. See the Decisions
> Log for why.

---

## Section 1: Data Models

Three related models — `Product`, `Order`, and `OrderItem` — plus a `User`
model that the auth endpoints sit on top of. `OrderItem` is the join model that
sits at the intersection of `Order` and `Product`.

### User

| Field | Prisma type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `Int` | yes | `autoincrement()` | **Primary key**, auto-increments |
| `name` | `String` | yes | — | |
| `email` | `String` | yes | — | `@unique` |
| `password` | `String` | yes | — | bcrypt hash, never returned to clients |
| `is_admin` | `Boolean` | yes | `false` | |
| `created_at` | `DateTime` | yes | `now()` | |

- **Relationships:** one User has many Orders (`orders Order[]`).

### Product

| Field | Prisma type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `Int` | yes | `autoincrement()` | **Primary key**, auto-increments |
| `name` | `String` | yes | — | |
| `description` | `String` | yes | — | |
| `price` | `Int` | yes | — | **cents** |
| `image_url` | `String?` | no | `null` | optional |
| `category` | `String` | yes | `"misc"` | |

- **Relationships:** one Product has many OrderItems (`orderItems OrderItem[]`).
- **Cascade behavior:** deleting a Product deletes every OrderItem that
  references it (enforced on the OrderItem side — see below).

### Order

| Field | Prisma type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `order_id` | `Int` | yes | `autoincrement()` | **Primary key**, auto-increments |
| `customer_id` | `Int` | yes | — | FK → `User.id` |
| `total_price` | `Int` | yes | `0` | **cents**, computed at creation |
| `status` | `String` | yes | `"pending"` | |
| `created_at` | `DateTime` | yes | `now()` | |

- **Relationships:** one Order belongs to one User (`customer`); one Order has
  many OrderItems (`orderItems OrderItem[]`).
- **Cascade behavior:** deleting an Order deletes every OrderItem that
  references it (enforced on the OrderItem side — see below).

### OrderItem

| Field | Prisma type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `order_item_id` | `Int` | yes | `autoincrement()` | **Primary key**, auto-increments |
| `order_id` | `Int` | yes | — | FK → `Order.order_id` |
| `product_id` | `Int` | yes | — | FK → `Product.id` |
| `quantity` | `Int` | yes | `1` | |
| `price` | `Int` | yes | — | **cents**, unit price captured at purchase time |

- **Relationships:** OrderItem belongs to one Order **and** one Product. It sits
  at the intersection of the Order ⇄ Product relationship.

### Cascade Delete Rules (the important part)

Both cascade rules are declared **on the OrderItem foreign keys** using Prisma's
`onDelete: Cascade`:

1. **Deleting a Product** → PostgreSQL removes every OrderItem whose
   `product_id` matches. (`product Product @relation(..., onDelete: Cascade)`)
2. **Deleting an Order** → PostgreSQL removes every OrderItem whose `order_id`
   matches. (`order Order @relation(..., onDelete: Cascade)`)

Dependency chain in plain language: `OrderItem` is a **child** of both `Order`
and `Product`. Deleting either parent removes the child. `Order` and `Product`
are independent of each other — deleting an Order does **not** delete Products,
and vice versa. Only the join rows disappear.

---

## Section 2: API Contract

**Consistent error shape for the entire API:**

```json
{ "error": { "message": "human readable message", "status": 400 } }
```

Every endpoint that can fail returns this shape with the appropriate HTTP
status. Success responses wrap the resource in a named key (`product`,
`products`, `order`, `orders`, `orderItem`, `orderItems`).

### Products

#### `GET /products`
- **Query params (optional):** `category` (e.g. `?category=clothing`), `sort`
  (`price` or `name`). Documented in detail in the Milestone 2 subsection below.
- **Success:** `200` → `{ "products": [ Product, ... ] }`
- **Error:** `500` → error shape (unexpected DB failure).

#### `GET /products/:id`
- **Params:** `id` (integer).
- **Success:** `200` → `{ "product": Product }`
- **Error:** `404` → `{ "error": { "message": "No product found with id: 999", "status": 404 } }`

#### `POST /products`
- **Body:** `{ name, description, price, image_url?, category? }`
- **Success:** `201` → `{ "product": Product }`
- **Error:** `400` when a required field (`name`, `description`, `price`) is missing.

#### `PUT /products/:id`
- **Params:** `id`. **Body:** any subset of `{ name, description, price, image_url, category }`.
- **Success:** `200` → `{ "product": Product }`
- **Error:** `404` when the product doesn't exist.

#### `DELETE /products/:id`
- **Params:** `id`.
- **Success:** `200` → `{ "product": Product }` (the deleted product). Associated OrderItems are cascade-deleted.
- **Error:** `404` when the product doesn't exist.

##### Query Parameters for `GET /products` (Milestone 2)

| Param | Values | Behavior |
| --- | --- | --- |
| `category` | any category string (`food`, `clothing`, `accessories`, `tech`, …) | Return only products in that category. |
| `sort` | `price` \| `name` | Order results ascending by that field. Any other value is ignored. |

- **Default (no params):** return **all** products, unordered.
- **Combined:** `?category=clothing&sort=price` → clothing products, cheapest first.
- **Invalid category** (e.g. `?category=nonsense`): returns `200` with an empty
  array `{ "products": [] }` — not an error.

### Orders

#### `GET /orders`
- **Query params (optional, stretch):** `email` — filter to orders placed by the customer with that email.
- **Success:** `200` → `{ "orders": [ Order (with orderItems + product), ... ] }`, newest first.

#### `GET /orders/:order_id`
- **Params:** `order_id`.
- **Success:** `200` → `{ "order": Order }` where `order.orderItems` is an array, each item including its `product`.
- **Error:** `404` when the order doesn't exist.

#### `POST /orders`  — see Section 3 for the full transactional flow
- **Body:**
  ```json
  {
    "order": { "customer_id": 1, "status": "pending" },
    "items": [
      { "product_id": 3, "quantity": 2 },
      { "product_id": 7, "quantity": 1 }
    ]
  }
  ```
- **Success:** `201` → `{ "order": Order }` including `order_id`, computed
  `total_price`, and the full `orderItems` array (each with its `product`).
- **Errors:**
  - `400` — `items` is missing/empty, or `order.customer_id` is missing.
  - `400` — an item references a `product_id` that doesn't exist. **No partial order is created.**

#### `PUT /orders/:order_id`
- **Params:** `order_id`. **Body:** any subset of `{ status, total_price, customer_id }` (most commonly `status`).
- **Success:** `200` → `{ "order": Order }`
- **Error:** `404` when the order doesn't exist.

#### `DELETE /orders/:order_id`
- **Params:** `order_id`.
- **Success:** `200` → `{ "order": Order }` (the deleted order). Associated OrderItems are cascade-deleted.
- **Error:** `404` when the order doesn't exist.

#### `POST /orders/:order_id/items`  *(stretch)*
- **Params:** `order_id`. **Body:** `{ product_id, quantity? }`.
- **Success:** `201` → `{ "orderItem": OrderItem (with product) }`
- **Errors:** `404` order not found; `400` product not found / `product_id` missing.

### Order Items

#### `GET /order-items`  *(stretch)*
- **Success:** `200` → `{ "orderItems": [ OrderItem (with product), ... ] }`

### Auth (layered on the User model)

| Endpoint | Body | Success | Error |
| --- | --- | --- | --- |
| `POST /auth/register` | `{ name, email, password }` | `201` → `{ user, token }` | `400` invalid/duplicate email or missing field |
| `POST /auth/login` | `{ email, password }` | `200` → `{ user, token }` | `401` invalid credentials |
| `GET /auth/me` | — (Bearer token) | `200` → `{ user }` | `401` when not authenticated |

`user` never includes the password hash.

---

## Section 3: Transactional Flow — `POST /orders`

This is the most architecturally significant endpoint. It must create an
`Order` **and** its `OrderItem`s **atomically**: if anything fails, nothing is
written.

### Request body

```json
{
  "order": { "customer_id": 1, "status": "pending" },
  "items": [
    { "product_id": 3, "quantity": 2 },
    { "product_id": 7, "quantity": 1 }
  ]
}
```

### Step-by-step at the data layer

All steps run inside a single `prisma.$transaction(async (tx) => { ... })`:

1. **Validate the request** (before opening the transaction): `order.customer_id`
   is present and `items` is a non-empty array. Otherwise → `400`.
2. **Fetch the referenced products** in one query: `tx.product.findMany({ where: { id: { in: productIds } } })`.
   Build a lookup map of `id → product`.
3. **Build the line items and compute the total.** For each requested item:
   - If its `product_id` is **not** in the map → `throw BadRequestError`. Throwing
     inside `$transaction` aborts and **rolls back** the whole operation.
   - Otherwise capture the product's current `price` as the line-item unit price
     and add `price × quantity` to the running `total_price`.
4. **Create the Order with nested OrderItems** in a single write:
   `tx.order.create({ data: { customer_id, status, total_price, orderItems: { create: [...] } }, include: { orderItems: { include: { product: true } } } })`.
5. **Return** the created order with all its items included.

### What happens on failure?

If any awaited operation inside the callback throws (e.g. a nonexistent
`product_id` in step 3, or a DB error in step 4), `prisma.$transaction` **rolls
back every write** made inside the callback. The client receives the documented
error shape and **no partial order or dangling order items exist** in the
database.

### Response (success)

```json
{
  "order": {
    "order_id": 5,
    "customer_id": 1,
    "total_price": 448,
    "status": "pending",
    "created_at": "2026-07-01T18:00:00.000Z",
    "orderItems": [
      { "order_item_id": 9, "order_id": 5, "product_id": 3, "quantity": 2, "price": 150, "product": { ... } },
      { "order_item_id": 10, "order_id": 5, "product_id": 7, "quantity": 1, "price": 499, "product": { ... } }
    ]
  }
}
```

---

## Decisions Log — Product Model

- **Schema translation that went smoothly:** `id` as `Int @id
  @default(autoincrement())` maps directly to PostgreSQL `SERIAL PRIMARY KEY` —
  a one-line translation from the spec.
- **Field decision made during implementation that wasn't in the original
  spec:** kept `price` as `Int` (cents) rather than `Float` dollars. The starter
  frontend's `formatPrice` already divides by 100, and integer cents avoids
  floating-point rounding bugs on currency. Documented at the top of this file.
- **Route behavior that needed a spec update:** confirmed `PUT /products/:id`
  returns `200` with the updated product and `DELETE` returns `200` with the
  deleted product — matched the spec, no change needed. Added the "invalid
  category returns empty array, not an error" note to the Query Params table
  after testing.

## Decisions Log — Order Creation Transaction

- **What the Transactional Flow spec got right:** the order of operations —
  validate → fetch products → compute total → create Order with nested
  OrderItems — held up exactly during implementation.
- **What the spec missed that I discovered during implementation:** the spec
  didn't originally say what happens when `items` is empty. Added an explicit
  `400` validation check ("An order must include at least one item") and updated
  Section 2/3.
- **How the transaction error handling works (in my own words):**
  `prisma.$transaction(async (tx) => …)` runs everything against a transactional
  client `tx`. If the callback throws or rejects, Prisma issues a `ROLLBACK`, so
  none of the writes (the Order or any OrderItems) are committed. If it returns
  normally, Prisma `COMMIT`s them all together. That's what makes a nonexistent
  `product_id` fail cleanly with no half-created order.
- **One thing I'd design differently if starting over:** I'd consider decrementing
  a product `stock` count inside the same transaction, so overselling is
  impossible — a natural extension once inventory exists.

## Spec Reconciliation — Milestone 4 (Schema Audit)

### Schema vs. spec gaps found
- No structural gaps found — the schema matched the Data Models section. Added a
  clarifying comment on `OrderItem.price` ("unit price captured at purchase
  time") so the intent is obvious in the schema, not just here.
- Confirmed both cascade rules live on the **OrderItem** foreign keys (the child
  side), which is where Prisma enforces `onDelete`.

### Cascade delete verification
- Deleting a Product removes associated OrderItems: ✅ tested
- Deleting an Order removes associated OrderItems: ✅ tested

## Final Spec Reconciliation: Project Complete

### Full-system audit result
- All required endpoints (5 product + 5 order) plus the stretch endpoints match
  the API contract above.
- Found: the spec didn't originally document CORS. Added an implementation note —
  `cors()` is enabled globally in `server.js` so the Vite frontend
  (`http://localhost:5173`) can reach the API (`http://localhost:3000`).

### Gaps resolved during frontend integration
- The starter frontend posted `{ order: cart }` (a `{ productId: quantity }`
  map) and read products via `GET /store`. Updated the frontend to the documented
  contract: `GET /products` for the catalog and the `{ order, items }` body for
  `POST /orders`.
- The frontend read `product.image`; the spec/schema use `image_url`. Updated the
  frontend components to read `image_url`.
- Checkout needs a `customer_id`. The logged-in user's `id` (from `POST
  /auth/login`) is sent as `order.customer_id`.

### What the spec enabled during this project
- Writing the data models and the `POST /orders` transactional flow down first
  meant the schema, the model methods, and the route handlers all agreed on
  field names and the request/response shape before any code ran — the frontend
  integration was mostly renaming, not redesigning.
