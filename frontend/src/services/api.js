// One place that talks to the backend. Every component/hook goes through here,
// so auth headers, error handling and the DB->UI field mapping live in a
// single file instead of being scattered across fetch calls.

const BASE = import.meta.env.VITE_API_URL || '' // '' => Vite proxy handles /api

function authHeader() {
  const token = localStorage.getItem('ecru_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`)
  return data
}

// The DB stores `category / description / image / _id`; the UI components were
// written around `cat / desc / img / id`. Map here so the components stay
// unchanged: an adapter, not a rewrite.
const toUiProduct = (p) => ({
  id: p._id,
  name: p.name,
  cat: p.category,
  price: p.price,
  size: p.size,
  active: p.active,
  skin: p.skin,
  desc: p.description,
  img: p.image,
  tag: p.tag,
})

export const getProducts = async () => (await request('/products')).map(toUiProduct)

// Admin product CRUD. These send DB field names (category/description/image)
// and are authenticated automatically via the token in authHeader().
export const createProduct = (data) =>
  request('/products', { method: 'POST', body: data })

export const updateProduct = (id, data) =>
  request(`/products/${id}`, { method: 'PUT', body: data })

export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: 'DELETE' })

export const createOrder = (items) =>
  request('/orders', { method: 'POST', body: { items } })

export const authRegister = (payload) =>
  request('/auth/register', { method: 'POST', body: payload })

export const authLogin = (payload) =>
  request('/auth/login', { method: 'POST', body: payload })

export const authMe = () => request('/auth/me')
