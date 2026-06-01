import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getBox, updateBox, deleteBox } from '../services/boxService'
import { authImageUrl } from '../services/itemService'
import './ItemDetail.css'
import './BoxDetail.css'

export default function BoxDetail({ boxId, navigate }) {
  const [box, setBox] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState(null)
  const [showQr, setShowQr] = useState(false)

  const boxUrl = `${window.location.origin}/?box=${boxId}`

  useEffect(() => {
    getBox(boxId)
      .then(data => { setBox(data); setLoading(false) })
      .catch(() => { setError('Box not found.'); setLoading(false) })
  }, [boxId])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const startEdit = () => { setForm({ ...box }); setEditing(true) }
  const cancelEdit = () => { setEditing(false); setError(null) }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const updated = await updateBox(boxId, { name: form.name, description: form.description, location: form.location })
      setBox(prev => ({ ...prev, ...updated }))
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBox(boxId)
      navigate('box-list')
    } catch {
      setError('Failed to delete box.')
      setConfirmDelete(false)
    }
  }

  const handlePrint = () => window.print()

  if (loading) return <div className="detail-state">Loading…</div>
  if (error && !box) return <div className="detail-state">{error}</div>

  const label = `BOX-${String(box.id).padStart(3, '0')}`

  return (
    <div className="box-detail">

      {/* Print-only label — hidden on screen, shown when printing */}
      <div className="print-label">
        <QRCodeSVG value={boxUrl} size={180} />
        <div className="print-label-text">
          <div className="print-label-id">{label}</div>
          <div className="print-label-name">{box.name}</div>
          {box.location && <div className="print-label-location">{box.location}</div>}
        </div>
      </div>

      {/* Screen content — hidden when printing */}
      <div className="no-print">
        <header className="detail-header">
          <button className="back-btn" onClick={() => navigate('box-list')}>← Boxes</button>
          <span className="detail-id">{label}</span>
          {!editing && <button className="edit-btn" onClick={startEdit}>Edit</button>}
        </header>

        {!editing ? (
          <main className="box-detail-body">
            <h1 className="detail-name">{box.name}</h1>
            {box.location && <p className="box-location">📍 {box.location}</p>}
            {box.description && <p className="box-description">{box.description}</p>}

            <div className="box-actions">
              <button className="qr-btn" onClick={() => setShowQr(s => !s)}>
                {showQr ? 'Hide QR Code' : 'Show QR Code'}
              </button>
              <button className="print-btn" onClick={handlePrint}>Print Label</button>
            </div>

            {showQr && (
              <div className="qr-section">
                <QRCodeSVG value={boxUrl} size={200} />
                <p className="qr-hint">Scan to open this box on any device</p>
              </div>
            )}

            <section className="box-items-section">
              <h2 className="section-title">{box.item_count} item{box.item_count !== 1 ? 's' : ''} in this box</h2>
              {box.items?.length === 0 && (
                <p className="box-empty-note">No items assigned yet. Open an item and assign it to this box.</p>
              )}
              {box.items?.map(item => (
                <div key={item.id} className="box-item-row"
                  onClick={() => navigate('item-detail', item.id)} role="button" tabIndex={0}>
                  <div className="box-item-thumb">
                    {item.photo_url
                      ? <img src={authImageUrl(item.photo_url)} alt="" />
                      : <span>📦</span>}
                  </div>
                  <div className="box-item-info">
                    <span className="box-item-id">{item.id}</span>
                    <span className="box-item-name">{item.name}</span>
                    {item.location && <span className="box-item-location">📍 {item.location}</span>}
                  </div>
                  {item.quantity > 0 && (
                    <div className="box-item-qty">
                      <span>{item.quantity}</span>
                      {item.unit && <span className="box-item-unit">{item.unit}</span>}
                    </div>
                  )}
                </div>
              ))}
            </section>

            {error && <p className="form-error">{error}</p>}

            {confirmDelete ? (
              <div className="delete-confirm">
                <p>Delete this box? Items inside will be unassigned, not deleted.</p>
                <div className="confirm-actions">
                  <button className="confirm-cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  <button className="confirm-delete" onClick={handleDelete}>Yes, delete</button>
                </div>
              </div>
            ) : (
              <button className="delete-btn" onClick={() => setConfirmDelete(true)}>Delete Box</button>
            )}
          </main>
        ) : (
          <form className="add-form" onSubmit={handleSave}>
            <div className="field">
              <label htmlFor="edit-name">Name *</label>
              <input id="edit-name" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="edit-location">Location</label>
              <input id="edit-location" value={form.location || ''} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="edit-desc">Description</label>
              <textarea id="edit-desc" rows={2} value={form.description || ''}
                onChange={e => set('description', e.target.value)} />
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
    </div>
  )
}
