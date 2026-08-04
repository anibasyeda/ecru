import { useCallback, useEffect, useState } from 'react'

import { getProducts } from '../services/api'

// Encapsulates the products fetch + its loading/error state.
// `reload` is exposed so admin actions (add/edit/delete) can refetch the list.
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // useCallback keeps the same function identity between renders, so it's safe
  // to pass down and to list in the effect's dependency array.
  const load = useCallback(() => {
    setLoading(true)
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { products, loading, error, reload: load }
}
