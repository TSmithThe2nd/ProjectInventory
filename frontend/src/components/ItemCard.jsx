import { authImageUrl } from '../services/itemService'
import './ItemCard.css'

export default function ItemCard({ item, onClick }) {
  return (
    <div className="item-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="card-thumb">
        {item.photo_url
          ? <img src={authImageUrl(item.photo_url)} alt="" />
          : <span className="card-thumb-placeholder">📦</span>
        }
      </div>
      <div className="card-main">
        <span className="card-id">{item.id}</span>
        <h3 className="card-name">{item.name}</h3>
        {item.description && <p className="card-description">{item.description}</p>}
        {item.location && <p className="card-location">📍 {item.location}</p>}
        {item.tags?.length > 0 && (
          <div className="card-tags">
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag} className="card-tag">{tag}</span>
            ))}
            {item.tags.length > 2 && (
              <span className="card-tag">+{item.tags.length - 2}</span>
            )}
          </div>
        )}
        {item.box_id && (
          <div className="card-tags">
            <span className="card-box-badge">
              🗃️ BOX-{String(item.box_id).padStart(3, '0')}
              {item.box_name ? ` ${item.box_name}` : ''}
            </span>
          </div>
        )}
      </div>
      {item.quantity !== undefined && item.quantity !== '' && (
        <div className="card-qty-badge">
          <span className="card-qty">{item.quantity}</span>
          {item.unit && <span className="card-unit">{item.unit}</span>}
        </div>
      )}
    </div>
  )
}