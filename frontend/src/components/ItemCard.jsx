import './ItemCard.css'

export default function ItemCard({ item, onClick }) {
  return (
    <div className="item-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="card-main">
        <span className="card-id">{item.id}</span>
        <h3 className="card-name">{item.name}</h3>
        {item.location && <p className="card-location">{item.location}</p>}
      </div>
      <div className="card-meta">
        {item.quantity !== undefined && item.quantity !== '' && (
          <span className="card-qty">{item.quantity}{item.unit ? ` ${item.unit}` : ''}</span>
        )}
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
      </div>
    </div>
  )
}