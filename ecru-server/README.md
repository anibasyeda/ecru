# ÉCRU — Backend API (MERN)

Express + MongoDB REST API for the ÉCRU skincare store. Turns the React
frontend into a full-stack app: products come from a database, checkout saves
real orders, and users can sign up / log in with JWT.

Stack: **M**ongoDB · **E**xpress · **R**eact (separate repo) · **N**ode.

---

## Run it locally

You need Node 18+ and a MongoDB (local install, or a free MongoDB Atlas cluster).

```bash
cd ecru-server
npm install
cp .env.example .env      # then edit MONGO_URI + JWT_SECRET
npm run seed              # loads the 6 products into the DB
npm run dev               # API on http://localhost:5000
```

Then run the frontend (`ecru/`) with `npm run dev` — the Vite proxy sends
`/api/*` to this server.

Check it's alive: open `http://localhost:5000/api/health` → `{"status":"ok"}`.

---

## Project structure

```
src/
├─ index.js                 # app setup, mounts routes, starts server after DB connects
├─ config/db.js             # mongoose connection (one place)
├─ models/
│  ├─ Product.js            # catalogue item (validated schema)
│  ├─ User.js               # account + password hashing + compare method
│  └─ Order.js              # order with embedded line items (price snapshot)
├─ controllers/             # request -> response logic, no routing noise
│  ├─ productController.js
│  ├─ orderController.js
│  └─ authController.js
├─ routes/                  # url -> controller mapping + which middleware guards it
│  ├─ productRoutes.js
│  ├─ orderRoutes.js
│  └─ authRoutes.js
├─ middleware/
│  ├─ auth.js               # protect (hard) + optionalAuth (soft) JWT gates
│  └─ errorHandler.js       # notFound + central error responder
├─ utils/asyncHandler.js    # forwards async errors to the error middleware
└─ seed.js                  # one-off: load products into MongoDB
```

`client-integration/` holds the frontend files that change when you connect
to this API (drop them into `ecru/src/`, plus the `vite.config.js`).

---

## API reference

| Method | Route                | Auth        | Purpose                          |
|--------|----------------------|-------------|----------------------------------|
| GET    | /api/products        | —           | List all products                |
| GET    | /api/products/:id    | —           | One product                      |
| POST   | /api/orders          | optional    | Create an order (guest or user)  |
| GET    | /api/orders/mine     | required    | The logged-in user's orders      |
| POST   | /api/auth/register   | —           | Create account → returns JWT     |
| POST   | /api/auth/login      | —           | Log in → returns JWT             |
| GET    | /api/auth/me         | required    | Current user (restore session)   |

Auth routes return `{ _id, name, email, token }`. Send the token on protected
routes as `Authorization: Bearer <token>`.

---

## Why it's built this way (the decisions, for interviews)

- **Layered structure (routes → controllers → models).** Routes only map URLs
  and pick middleware; controllers hold logic; models own the schema. Each file
  has one job, which makes it testable and easy to extend.

- **Server recomputes order totals.** The checkout request sends only product
  IDs and quantities — never prices. `orderController` re-reads prices from the
  DB and computes the total, so a user editing the request in devtools can't
  change what they pay. This is the single most important call in the codebase.

- **Orders snapshot name + price.** Line items copy the price at purchase time.
  If a product's price changes later, historical orders still show what was
  actually paid.

- **`optionalAuth` vs `protect`.** Checkout uses a *soft* gate so guests can
  buy, but the order links to the user if they're logged in. `protect` is the
  *hard* gate for account-only routes. Same JWT verification, two policies.

- **Passwords: hashed with bcrypt, `select:false`.** The hash never comes back
  in a normal query, so it can't leak through `/auth/me`. Login opts back in
  explicitly. Wrong-email and wrong-password return the *same* message so the
  API doesn't reveal which emails exist.

- **One error path.** `asyncHandler` forwards rejected promises to a single
  `errorHandler`, so there's no repeated try/catch and every error returns the
  same JSON shape.

- **API adapter on the frontend.** The DB uses `category/description/image/_id`;
  the UI components were written around `cat/desc/img/id`. `services/api.js`
  maps between them, so connecting the backend didn't require touching the
  presentational components — a thin adapter instead of a rewrite.

---

## Connecting the frontend (what changes)

From `client-integration/`, copy into `ecru/`:

1. `vite.config.js` → project root (adds the `/api` dev proxy).
2. `services/api.js`, `hooks/useProducts.js` → `src/`.
3. `context/CartContext.jsx` (adds async `checkout`) and
   `context/AuthContext.jsx` → `src/context/`.
4. `components/ProductGrid.jsx` (fetches via the hook) and
   `components/CartDrawer.jsx` (real checkout) → `src/components/`.

Then delete `src/data/products.js` — the data now comes from the API.
For auth UI, wrap `<App/>` in `<AuthProvider>` and add a small login form that
calls `useAuth().login(...)`.

---

## Next steps (if you want to go further)

- Deploy: API on Render/Railway, DB on MongoDB Atlas, frontend on Vercel.
- Add admin-only product create/update/delete (role field on User + a guard).
- Pagination + search on `/api/products`.
- Rate-limit the auth routes.
