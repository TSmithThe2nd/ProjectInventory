import { useState, useEffect } from 'react'
import { getItem } from '../services/itemService'
import './ItemDetail.css'

export default function ItemDetail({ itemId, navigate }) {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getItem(itemId)
      .then(data => { setItem(data); setLoading(false) })
      .catch(() => { setError('Item not found.'); setLoading(false) })
  }, [itemId])

  if (loading) return <div className="detail-state">Loading…</div>
  if (error) return <div className="detail-state">{error}</div>

  return (
    <div className="item-detail">
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate('home')}>← Back</button>
        <span className="detail-id">{item.id}</span>
      </header>

      <main className="detail-body">
        <h1 className="detail-name">{item.name}</h1>

        {item.description && (
          <p className="detail-description">{item.description}</p>
        )}

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
          {item.date_added && (
            <div className="detail-field">
              <span className="field-label">Added</span>
              <span className="field-value">{item.date_added}</span>
            </div>
          )}
          {item.added_by && (
            <div className="detail-field">
              <span className="field-label">Added by</span>
              <span className="field-value">{item.added_by}</span>
            </div>
          )}
        </div>

        {item.tags?.length > 0 && (
          <div className="detail-section">
            <span className="field-label">Tags</span>
            <div className="detail-tags">
              {item.tags.map(tag => (
                <span key={tag} className="detail-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {item.notes && (
          <div className="detail-section">
            <span className="field-label">Notes</span>
            <p className="detail-notes">{item.notes}</p>
          </div>
        )}
      </main>
    </div>
  )
}