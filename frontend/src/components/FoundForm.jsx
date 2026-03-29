import { useState } from 'react'

const initialForm = {
  item_name: '', description: '', location: '',
  date_found: '', contact_name: '', contact_info: '',
}

function FoundForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState(null)
  const [phoneError, setPhoneError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'contact_info') {
      if (value === '') {
        setPhoneError('')
      } else if (!/^[789]\d{9}$/.test(value)) {
        setPhoneError('Enter a valid 10-digit mobile number')
      } else {
        setPhoneError('')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^\d{10}$/.test(formData.contact_info)) {
      setPhoneError('Enter a valid 10-digit mobile number')
      return
    }
    setLoading(true)
    setMatches(null)
    try {
      const res = await fetch('http://localhost:5000/found-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to submit found item')
        return
      }
      setMatches(data.matches || [])
      setFormData(initialForm)
      setPhoneError('')
      onSubmit?.()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
  const inputErrorClass = "w-full rounded-md border border-red-400 px-3 py-2 outline-none focus:border-red-500"

  return (
    <section className="rounded-lg bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">📦 Report Found Item</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input className={inputClass} name="item_name"    placeholder="Item name"        value={formData.item_name}    onChange={handleChange} required />
        <input className={inputClass} name="description"  placeholder="Description"      value={formData.description}  onChange={handleChange} required />
        <input className={inputClass} name="location"     placeholder="Location"         value={formData.location}     onChange={handleChange} required />
        <input className={inputClass} name="date_found"   type="date"                    value={formData.date_found}   onChange={handleChange} required />
        <input className={inputClass} name="contact_name" placeholder="Your name"        value={formData.contact_name} onChange={handleChange} required />

        <div>
          <input
            className={phoneError ? inputErrorClass : inputClass}
            name="contact_info"
            placeholder="10-digit mobile number"
            value={formData.contact_info}
            onChange={handleChange}
            maxLength={10}
            required
          />
          {phoneError && (
            <p className="mt-1 text-xs text-red-500">{phoneError}</p>
          )}
        </div>

        <button
          className="w-full rounded-md bg-emerald-600 px-3 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:bg-emerald-300"
          type="submit" disabled={loading || !!phoneError}
        >
          {loading ? 'Submitting...' : 'Submit Found Item'}
        </button>
      </form>

      {matches !== null && (
        <div className="mt-4">
          {matches.length === 0 ? (
            <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">No matching lost items found.</p>
          ) : (
            <div>
              <p className="mb-2 font-semibold text-emerald-700">🎉 {matches.length} matching lost item(s) found!</p>
              {matches.map((m) => (
                <div key={m.id} className="mb-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm">
                  <p className="font-medium text-slate-800">{m.item_name}</p>
                  <p className="text-slate-600">{m.description}</p>
                  <p className="text-slate-600">📍 {m.location}</p>
                  <p className="text-slate-600">👤 {m.contact_name} — {m.contact_info}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default FoundForm
