import { useState } from 'react'

const initialForm = {
  item_name: '',
  description: '',
  location: '',
  date_found: '',
  contact_name: '',
  contact_info: '',
}

function FoundForm() {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/found-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit found item')
      }

      setFormData(initialForm)
      alert('Found item submitted')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-lg bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">Report Found Item</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" name="item_name" placeholder="Item name" value={formData.item_name} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" name="date_found" type="date" value={formData.date_found} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" name="contact_name" placeholder="Your name" value={formData.contact_name} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" name="contact_info" placeholder="Contact info" value={formData.contact_info} onChange={handleChange} required />
        <button className="w-full rounded-md bg-emerald-600 px-3 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Found Item'}
        </button>
      </form>
    </section>
  )
}

export default FoundForm
