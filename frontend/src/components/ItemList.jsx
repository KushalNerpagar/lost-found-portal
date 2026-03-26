import { useEffect, useState } from 'react'

function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/found-items')
        if (!response.ok) {
          throw new Error('Failed to fetch found items')
        }
        const data = await response.json()
        setItems(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFoundItems()
  }, [])

  return (
    <section className="rounded-lg bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">Found Items</h2>

      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-slate-500">No found items yet.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-800">{item.item_name}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            <p className="mt-2 text-sm text-slate-700">Location: {item.location}</p>
            <p className="text-sm text-slate-700">Date: {item.date_found?.slice(0, 10)}</p>
            <p className="mt-2 text-sm text-slate-700">
              Contact: {item.contact_name} ({item.contact_info})
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ItemList
