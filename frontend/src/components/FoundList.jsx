import { useEffect, useState } from 'react'

function FoundList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const fetchItems = async (q = '') => {
    setLoading(true)
    setError('')
    try {
      const url = q
        ? `http://localhost:5000/found-items?query=${encodeURIComponent(q)}`
        : `http://localhost:5000/found-items`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch found items')
      const data = await res.json()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setSearch(val)
    fetchItems(val)
  }

  const handleResolve = async (id) => {
    if (!confirm('Mark this item as resolved/claimed?')) return
    try {
      await fetch(`http://localhost:5000/found-items/${id}/resolve`, { method: 'PATCH' })
      fetchItems(search)
    } catch {
      alert('Failed to resolve item')
    }
  }

  const statusBadge = (status) => {
    const map = {
      found:    'bg-emerald-100 text-emerald-700',
      resolved: 'bg-green-100 text-green-700',
    }
    return `inline-block rounded-full px-2 py-0.5 text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-600'}`
  }

  return (
    <section className="rounded-lg bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-800">📦 Found Items</h2>
        <input
          className="w-64 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
          placeholder="Search by name or location..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {loading && <p className="text-slate-500">Loading...</p>}
      {error   && <p className="text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="text-slate-500">No found items yet.</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">{item.item_name}</h3>
                <span className={statusBadge(item.status)}>{item.status}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              <p className="mt-2 text-sm text-slate-700">📍 {item.location}</p>
              <p className="text-sm text-slate-700">📅 {item.date_found?.slice(0, 10)}</p>
              <p className="mt-2 text-sm text-slate-700">👤 {item.contact_name} — {item.contact_info}</p>
            </div>
            {item.status !== 'resolved' && (
              <button
                onClick={() => handleResolve(item.id)}
                className="mt-3 w-full rounded-md bg-emerald-600 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                ✅ Mark as Resolved
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default FoundList
