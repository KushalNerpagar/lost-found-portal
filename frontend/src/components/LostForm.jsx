import { useState } from 'react'

const initialForm = {
  item_name: '', description: '', location: '',
  date_lost: '', contact_name: '', contact_info: '',
}

function LostForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
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
    try {
      const res = await fetch('http://localhost:5000/lost-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to submit lost item')
        return
      }
      setFormData(initialForm)
      setPhoneError('')
      alert('✅ Lost item reported!')
      onSubmit?.()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
  const inputErrorClass = "w-full rounded-md border border-red-400 px-3 py-2 outline-none focus:border-red-500"

  return (
    <section className="rounded-lg bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-800"> Report Lost Item</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input className={inputClass} name="item_name"    placeholder="Item name"        value={formData.item_name}    onChange={handleChange} required />
        <input className={inputClass} name="description"  placeholder="Description"      value={formData.description}  onChange={handleChange} required />
        <input className={inputClass} name="location"     placeholder="Location"         value={formData.location}     onChange={handleChange} required />
        <input className={inputClass} name="date_lost"    type="date"                    value={formData.date_lost}    onChange={handleChange} required />
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
          className="w-full rounded-md bg-blue-600 px-3 py-2 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          type="submit" disabled={loading || !!phoneError}
        >
          {loading ? 'Submitting...' : 'Submit Lost Item'}
        </button>
      </form>
    </section>
  )
}

export default LostForm
