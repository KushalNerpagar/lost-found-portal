import { useEffect, useState } from 'react'

function MatchList() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('http://localhost:5000/found-items/matches')
        if (!res.ok) throw new Error('Failed to fetch matches')
        const data = await res.json()
        setMatches(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  return (
    <section className="rounded-lg bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">🔗 Matches</h2>
      <p className="mb-4 text-sm text-slate-500">Items where a found item matches a lost item by name and location.</p>

      {loading && <p className="text-slate-500">Loading...</p>}
      {error   && <p className="text-red-600">{error}</p>}
      {!loading && !error && matches.length === 0 && (
        <p className="text-slate-500">No matches yet. Matches appear automatically when a found item matches a lost item.</p>
      )}

      <div className="flex flex-col gap-4">
        {matches.map((m) => (
          <div key={m.match_id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Match #{m.match_id}</span>
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                {m.match_status}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Lost Item */}
              <div className="rounded-md border border-red-200 bg-red-50 p-3">
                <p className="mb-1 text-xs font-bold uppercase text-red-500">Lost Item</p>
                <p className="font-semibold text-slate-800">{m.lost_item}</p>
                <p className="text-sm text-slate-600">📍 {m.lost_location}</p>
                <p className="text-sm text-slate-600">📅 {m.date_lost?.slice(0, 10)}</p>
                <p className="mt-1 text-sm text-slate-700">👤 {m.lost_contact} — {m.lost_contact_info}</p>
              </div>
              {/* Found Item */}
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                <p className="mb-1 text-xs font-bold uppercase text-emerald-500">Found Item</p>
                <p className="font-semibold text-slate-800">{m.found_item}</p>
                <p className="text-sm text-slate-600">📍 {m.found_location}</p>
                <p className="text-sm text-slate-600">📅 {m.date_found?.slice(0, 10)}</p>
                <p className="mt-1 text-sm text-slate-700">👤 {m.found_contact} — {m.found_contact_info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MatchList
