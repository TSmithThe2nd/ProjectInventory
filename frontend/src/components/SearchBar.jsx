import './SearchBar.css'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search items…"
        aria-label="Search items"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear">×</button>
      )}
    </div>
  )
}