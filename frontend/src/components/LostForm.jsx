import { useState } from 'react'

const initialForm = {
  item_name: '',
  description: '',
  location: '',
  date_lost: '',
  contact_name: '',
  contact_info: '',
}

function LostForm() {
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
      const response = await fetch('http://localhost:5000/lost-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit lost item')
      }

      setFormData(initialForm)
      alert('Lost item submitted')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-lg bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">Report Lost Item</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" name="item_name" placeholder="Item name" value={formData.item_name} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" name="date_lost" type="date" value={formData.date_lost} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" name="contact_name" placeholder="Your name" value={formData.contact_name} onChange={handleChange} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" name="contact_info" placeholder="Contact info" value={formData.contact_info} onChange={handleChange} required />
        <button className="w-full rounded-md bg-blue-600 px-3 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Lost Item'}
        </button>
      </form>
    </section>
  )
}

export default LostForm
