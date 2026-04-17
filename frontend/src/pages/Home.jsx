import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import TagFilter from '../components/TagFilter'
import ItemCard from '../components/ItemCard'
import { getItems } from '../services/itemService'
import './Home.css'

const TAGS = ['Plumbing', 'Electrical', 'Drywall', 'Lighting', 'Decor', 'Flooring', 'HVAC', 'General Hardware']

export default function Home({ navigate }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getItems()
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = items.filter(item => {
    const matchSearch = !search || item.name?.toLowerCase().includes(search.toLowerCase())
    const matchTag = !activeTag || item.tags?.includes(activeTag)
    return matchSearch && matchTag
  })

  return (
    <div className="home">
      <header className="home-header">
        <h1>Inventory</h1>
        <span className="item-count">{items.length} items</span>
      </header>
      <div className="home-controls">
        <SearchBar value={search} onChange={setSearch} />
        <TagFilter tags={TAGS} active={activeTag} onSelect={setActiveTag} />
      </div>
      <main className="home-list">
        {loading && <p className="list-state">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="list-state">No items found.</p>
        )}
        {filtered.map(item => (
          <ItemCard key={item.id} item={item} onClick={() => navigate('item-detail', item.id)} />
        ))}
      </main>
      <button className="fab" onClick={() => navigate('add-item')} aria-label="Add item">
        +
      </button>
    </div>
  )
}