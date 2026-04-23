import { useState, useEffect } from 'react'
import { getItem, updateItem, deleteItem, uploadPhoto, authImageUrl } from '../services/itemService'
import './ItemDetail.css'

const TAGS = ['Plumbing', 'Electrical', 'Drywall', 'Lighting', 'Decor', 'Flooring', 'HVAC', 'General Hardware']

export default function ItemDetail({ itemId, navigate }) {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    getItem(itemId)
      .then(data => { setItem(data); setLoading(false) })
      .catch(() => { setError('Item not found.'); setLoading(false) })
  }, [itemId])

  const startEdit = () => {
    setForm({ ...item })
    setPhotoFile(null)
    setPhotoPreview(null)
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setPhotoFile(null)
    setPhotoPreview(null)
    setError(null)
  }

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const toggleTag = tag => set('tags',
    form.tags?.includes(tag) ? form.tags.filter(t => t !== tag) : [...(form.tags || []), tag]
  )

  const handlePhotoChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    set('photo_url', null)
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      let updatedForm = { ...form }
      if (photoFile) {
        const result = await uploadPhoto(photoFile)
        updatedForm.photo_url = result.photo_url
      }
      const updated = await updateItem(itemId, updatedForm)
      setItem(updated)
      setEditing(false)
      setPhotoFile(null)
      setPhotoPreview(null)
    } catch (err) {
      setError(`Failed to save: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteItem(itemId)
      navigate('home')
    } catch {
      setError('Failed to delete.')
      setConfirmDelete(false)
    }
  }

  // What to show as the photo in edit mode:
  // - new selection preview takes priority over existing server photo
  const editPhotoSrc = photoPreview || (form?.photo_url ? authImageUrl(form.photo_url) : null)

  if (loading) return <div className="detail-state">Loading…</div>
  if (error && !item) return <div className="detail-state">{error}</div>

  return (
    <div className="item-detail">
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate('home')}>← Back</button>
        <span className="detail-id">{item.id}</span>
        {!editing && (
          <button className="edit-btn" onClick={startEdit}>Edit</button>
        )}
      </header>

      {!editing ? (
        <main className="detail-body">
          {item.photo_url && (
            <img className="detail-photo" src={authImageUrl(item.photo_url)} alt={item.name} />
          )}
          <h1 className="detail-name">{item.name}</h1>
          {item.description && <p className="detail-description">{item.description}</p>}

          <div className="detail-grid">
            {(item.quantity !== undefined && item.quantity !== '') && (
              <div className="detail-field">
                <span className="field-label">Quantity</span>
                <span className="field-value">{item.quantity}{item.unit ? ` ${item.unit}` : ''}</span>
              </div>
            )}
            {item.location && (
              <div className="detail-field">
                <span className="field-label">Location</span>
                <span className="field-value">{item.location}</span>
              </div>
            )}
          </div>

          {item.tags?.length > 0 && (
            <div className="detail-section">
              <span className="field-label">Tags</span>
              <div className="detail-tags">
                {item.tags.map(tag => <span key={tag} className="detail-tag">{tag}</span>)}
              </div>
            </div>
          )}

          {item.notes && (
            <div className="detail-section">
              <span className="field-label">Notes</span>
              <p className="detail-notes">{item.notes}</p>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          {confirmDelete ? (
            <div className="delete-confirm">
              <p>Delete this item?</p>
              <div className="confirm-actions">
                <button className="confirm-cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
                <button className="confirm-delete" onClick={handleDelete}>Yes, delete</button>
              </div>
            </div>
          ) : (
            <button className="delete-btn" onClick={() => setConfirmDelete(true)}>Delete Item</button>
          )}
        </main>
      ) : (
        <form className="add-form" onSubmit={handleSave}>

          <div className="field">
            <label>Photo</label>
            {editPhotoSrc ? (
              <div className="photo-preview">
                <img src={editPhotoSrc} alt="Preview" />
                <div className="photo-edit-actions">
                  <label className="photo-change-btn" htmlFor="edit-photo">
                    Change
                    <input id="edit-photo" type="file" accept="image/*" capture="environment"
                      onChange={handlePhotoChange} />
                  </label>
                  <button type="button" className="photo-remove-btn" onClick={removePhoto}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="photo-input-label" htmlFor="edit-photo">
                📷 Take or choose a photo
                <input id="edit-photo" type="file" accept="image/*" capture="environment"
                  onChange={handlePhotoChange} />
              </label>
            )}
          </div>

          <div className="field">
            <label htmlFor="name">Name *</label>
            <input id="name" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows={2} value={form.description || ''}
              onChange={e => set('description', e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="quantity">Quantity</label>
              <input id="quantity" type="number" min="0" value={form.quantity || ''}
                onChange={e => set('quantity', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="unit">Unit</label>
              <input id="unit" value={form.unit || ''} onChange={e => set('unit', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="location">Location</label>
            <input id="location" value={form.location || ''} onChange={e => set('location', e.target.value)} />
          </div>
          <div className="field">
            <label>Tags</label>
            <div className="tag-grid">
              {TAGS.map(tag => (
                <button key={tag} type="button"
                  className={`tag-chip ${form.tags?.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" rows={2} value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="edit-actions">
            <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={saving || !form.name?.trim()}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}