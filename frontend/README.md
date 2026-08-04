# ÉCRU — React (Vite + Tailwind)

A component-based rebuild of the ÉCRU skincare store. This is the frontend
you'll later connect to a MERN backend.

## Run it

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build into /dist
npm run preview  # preview the production build
```

## Project structure

```
src/
├─ main.jsx                # entry point
├─ App.jsx                 # composes the page + owns the product-modal state
├─ index.css               # Tailwind directives + a couple of base rules
├─ data/products.js        # products + hero/split images (your future API data)
├─ context/CartContext.jsx # cart state: add / remove / changeQty / totals / drawer
└─ components/
   ├─ Navbar.jsx           # logo, links, live cart count
   ├─ Hero.jsx
   ├─ Marquee.jsx
   ├─ ProductGrid.jsx      # maps over products
   ├─ ProductCard.jsx      # hover add-to-cart, click to open modal
   ├─ About.jsx
   ├─ Newsletter.jsx
   ├─ Footer.jsx
   ├─ CartDrawer.jsx       # slide-out cart
   └─ ProductModal.jsx     # product detail + add to cart
```

## How state flows

- `CartProvider` (context) holds the cart array and the drawer open/close flag.
  Any component reads it with `useCart()` — that's why the navbar count and the
  drawer stay in sync.
- The **product modal** is owned by `App` via `useState` and passed down, so only
  one product opens at a time.

## Styling

Tailwind CSS. The brand palette and fonts live in `tailwind.config.js`:
`ink`, `paper`, `paper-2`, `line`, `muted`, `gold`, `gold-soft`, plus the
`marquee` keyframe/animation. Fonts (Fraunces + Inter) load from Google Fonts
in `index.html`.

## Next: wiring in MERN

The app is already shaped for it. When you build the backend:

1. **MongoDB** — a `products` collection. Seed it from `src/data/products.js`.
2. **Express + Node** — an API: `GET /api/products`, `GET /api/products/:id`,
   and later `POST /api/orders`, plus auth routes.
3. **Frontend swap** — replace the static import in `ProductGrid`/data with a
   `fetch('/api/products')` inside a `useEffect` (or React Query). Nothing else
   in the components has to change.
4. **Cart/checkout** — `CartContext` stays; `Checkout →` calls `POST /api/orders`.
5. **Auth** — add a `AuthContext` alongside `CartContext` for login/JWT.

Suggested folder layout for the full stack:

```
ecru/            # this React app (frontend)
server/          # Express API
  ├─ models/     # Mongoose schemas (Product, Order, User)
  ├─ routes/
  ├─ controllers/
  └─ index.js
```

Run the two together in dev with a Vite proxy (`vite.config.js` → `server.proxy`)
pointing `/api` at your Express port.
