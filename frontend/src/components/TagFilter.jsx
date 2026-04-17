import './TagFilter.css'

export default function TagFilter({ tags, active, onSelect }) {
  return (
    <div className="tag-filter">
      <button
        className={`filter-chip ${!active ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          className={`filter-chip ${active === tag ? 'active' : ''}`}
          onClick={() => onSelect(active === tag ? null : tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}