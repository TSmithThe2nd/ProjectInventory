import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getBoxes, createBox } from '../services/boxService'
import './BoxList.css'

export default function BoxList({ navigate }) {
  const [boxes, setBoxes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', location: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [printMode, setPrintMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => {
    getBoxes()
      .then(data => { setBoxes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleCreate = async e => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const box = await createBox(form)
      setBoxes(prev => [...prev, box])
      setForm({ name: '', description: '', location: '' })
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const enterPrintMode = () => {
    setSelectedIds(new Set(boxes.map(b => b.id)))
    setPrintMode(true)
  }
  const exitPrintMode = () => {
    setPrintMode(false)
    setSelectedIds(new Set())
  }
  const toggleSelect = id => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const allSelected = boxes.length > 0 && selectedIds.size === boxes.length
  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? new Set() : new Set(boxes.map(b => b.id)))

  const origin = window.location.origin

  return (
    <div className="box-list">

      {/* ── Screen content (hidden during print) ── */}
      <div className="no-print">
        {!printMode ? (
          <header className="box-list-header">
            <button className="back-btn" onClick={() => navigate('home')}>← Back</button>
            <h1>Boxes</h1>
            <div className="header-actions">
              {boxes.length > 0 && (
                <button className="print-mode-btn" onClick={enterPrintMode}>Print Labels</button>
              )}
              <button className="new-box-btn" onClick={() => setShowForm(s => !s)}>
                {showForm ? 'Cancel' : '+ New'}
              </button>
            </div>
          </header>
        ) : (
          <header className="box-list-header">
            <button className="back-btn" onClick={exitPrintMode}>Cancel</button>
            <h1>Select Labels</h1>
            <div className="print-header-actions">
              <button className="select-all-btn" onClick={toggleSelectAll}>
                {allSelected ? 'None' : 'All'}
              </button>
              <button
                className="print-submit-btn"
                onClick={() => window.print()}
                disabled={selectedIds.size === 0}
              >
                Print{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
              </button>
            </div>
          </header>
        )}

        {!printMode && showForm && (
          <form className="new-box-form" onSubmit={handleCreate}>
            <div className="field">
              <label htmlFor="box-name">Box name *</label>
              <input id="box-name" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Kitchen Misc, Holiday Decor" required autoFocus />
            </div>
            <div className="field">
              <label htmlFor="box-location">Location</label>
              <input id="box-location" value={form.location} onChange={e => set('location', e.target.value)}
                placeholder="e.g. Garage shelf 2, Basement" />
            </div>
            <div className="field">
              <label htmlFor="box-desc">Description</label>
              <textarea id="box-desc" rows={2} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Optional notes about this box" />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="submit-btn" disabled={saving || !form.name.trim()}>
              {saving ? 'Creating…' : 'Create Box'}
            </button>
          </form>
        )}

        <main className="box-list-body">
          {loading && <p className="list-state">Loading…</p>}
          {!loading && boxes.length === 0 && !showForm && (
            <div className="empty-state">
              <span className="empty-icon">🗃️</span>
              <h2>No boxes yet</h2>
              <p>Create a box to start organizing items into labeled containers.</p>
              <button className="empty-cta" onClick={() => setShowForm(true)}>+ Create First Box</button>
            </div>
          )}
          {boxes.map(box => (
            <div
              key={box.id}
              className={`box-card${printMode && selectedIds.has(box.id) ? ' box-card-selected' : ''}`}
              onClick={() => printMode ? toggleSelect(box.id) : navigate('box-detail', box.id)}
              role="button"
              tabIndex={0}
            >
              {printMode && (
                <div className={`select-circle${selectedIds.has(box.id) ? ' checked' : ''}`} />
              )}
              <div className="box-card-icon">🗃️</div>
              <div className="box-card-main">
                <div className="box-card-id">BOX-{String(box.id).padStart(3, '0')}</div>
                <h3 className="box-card-name">{box.name}</h3>
                {box.location && <p className="box-card-location">📍 {box.location}</p>}
              </div>
              <div className="box-card-count">
                <span className="box-count-num">{box.item_count}</span>
                <span className="box-count-label">items</span>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* ── Print sheet (hidden on screen, shown when printing) ── */}
      <div className="mass-print-sheet">
        {boxes
          .filter(b => selectedIds.has(b.id))
          .map(box => (
            <div key={box.id} className="mass-print-label">
              <QRCodeSVG value={`${origin}/?box=${box.id}`} size={130} />
              <div className="mass-print-label-text">
                <div className="mass-print-label-id">BOX-{String(box.id).padStart(3, '0')}</div>
                <div className="mass-print-label-name">{box.name}</div>
                {box.location && <div className="mass-print-label-location">{box.location}</div>}
              </div>
            </div>
          ))}
      </div>

    </div>
  )
}