import { useEffect, useState } from 'react'

function LostList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [resolvingIds, setResolvingIds] = useState([]) 

  const fetchItems = async (q = '') => {
    setLoading(true)
    setError('')
    try {
      const url = q
        ? `http://localhost:5000/lost-items?query=${encodeURIComponent(q)}`
        : `http://localhost:5000/lost-items`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch lost items')
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
    if (!confirm('Mark this item as resolved? It will be removed.')) return
    try {
      const res = await fetch(`http://localhost:5000/lost-items/${id}/resolve`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Failed to resolve')

      setResolvingIds((prev) => [...prev, id])
      setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id))
        setResolvingIds((prev) => prev.filter((rid) => rid !== id))
      }, 3000)
    } catch {
      alert('Failed to resolve item')
    }
  }

  return (
    <section className="rounded-lg bg-white p-5 shadow">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800">
           Lost Items
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-normal text-slate-500">
            {items.length}
          </span>
        </h2>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 sm:w-64"
          placeholder="Search by name or location..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {loading && <p className="text-slate-500">Loading...</p>}
      {error   && <p className="text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-slate-500">No lost items found.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isResolving = resolvingIds.includes(item.id)
          return (
            <article
              key={item.id}
              className={`flex flex-col justify-between rounded-lg border p-4 transition-all duration-500 ${
                isResolving
                  ? 'border-green-300 bg-green-50 opacity-60'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{item.item_name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    isResolving
                      ? 'bg-green-100 text-green-700'
                      : item.status === 'resolved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {isResolving ? ' resolved' : item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                <p className="mt-2 text-sm text-slate-700">{item.location}</p>
                <p className="text-sm text-slate-700"> {item.date_lost?.slice(0, 10)}</p>
                <p className="mt-2 text-sm text-slate-700"> {item.contact_name} — {item.contact_info}</p>
              </div>
              {!isResolving && (
                <button
                  onClick={() => handleResolve(item.id)}
                  className="mt-3 w-full rounded-md bg-blue-600 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                 Mark as Resolved
                </button>
              )}
              {isResolving && (
                <p className="mt-3 text-center text-sm text-green-600 font-medium">
                  Removing in 3s...
                </p>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default LostList
