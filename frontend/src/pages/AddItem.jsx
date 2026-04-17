import { useState } from 'react'
import { createItem } from '../services/itemService'
import './AddItem.css'

const TAGS = ['Plumbing', 'Electrical', 'Drywall', 'Lighting', 'Decor', 'Flooring', 'HVAC', 'General Hardware']

export default function AddItem({ navigate }) {
  const [form, setForm] = useState({
    name: '', description: '', quantity: '', unit: '', location: '', tags: [], notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const toggleTag = tag => set('tags',
    form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag]
  )

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await createItem(form)
      navigate('home')
    } catch {
      setError('Failed to save — is the backend running?')
      setSaving(false)
    }
  }

  return (
    <div className="add-item">
      <header className="add-header">
        <button className="back-btn" onClick={() => navigate('home')}>← Back</button>
        <h1>Add Item</h1>
      </header>
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Name *</label>
          <input id="name" value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. PVC Pipe ½ inch" required />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={2} value={form.description}
            onChange={e => set('description', e.target.value)} placeholder="Optional details" />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="quantity">Quantity</label>
            <input id="quantity" type="number" min="0" value={form.quantity}
              onChange={e => set('quantity', e.target.value)} placeholder="0" />
          </div>
          <div className="field">
            <label htmlFor="unit">Unit</label>
            <input id="unit" value={form.unit} onChange={e => set('unit', e.target.value)}
              placeholder="pcs, ft, box…" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="location">Location</label>
          <input id="location" value={form.location} onChange={e => set('location', e.target.value)}
            placeholder="e.g. 123 Main St – Storage Room" />
        </div>
        <div className="field">
          <label>Tags</label>
          <div className="tag-grid">
            {TAGS.map(tag => (
              <button key={tag} type="button"
                className={`tag-chip ${form.tags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" rows={2} value={form.notes}
            onChange={e => set('notes', e.target.value)} placeholder="Any additional info" />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="submit-btn" disabled={saving || !form.name.trim()}>
          {saving ? 'Saving…' : 'Save Item'}
        </button>
      </form>
    </div>
  )
}