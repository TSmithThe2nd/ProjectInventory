import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import TagFilter from '../components/TagFilter'
import ItemCard from '../components/ItemCard'
import { getItems } from '../services/itemService'
import './Home.css'

const TAGS = ['Plumbing', 'Electrical', 'Drywall', 'Lighting', 'Decor', 'Flooring', 'HVAC', 'General Hardware']

export default function Home({ navigate, offline }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState(null)

  const handleSync = async () => {
    setSyncing(true)
    setSyncMsg(null)
    try {
      const res = await fetch('/api/sync', { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sync failed')
      setSyncMsg(`Synced ${data.synced} items`)
    } catch (err) {
      setSyncMsg(err.message)
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMsg(null), 3000)
    }
  }

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
        <div className="header-right">
          {syncMsg && <span className="sync-msg">{syncMsg}</span>}
          <button
            className="sync-btn"
            onClick={handleSync}
            disabled={syncing || offline}
            title={offline ? 'Unavailable offline' : 'Sync to Google Sheets'}
          >
            {syncing ? 'Syncing…' : 'Sync'}
          </button>
          <span className="item-count">{items.length} items</span>
        </div>
      </header>
      <div className="home-controls">
        <SearchBar value={search} onChange={setSearch} />
        <TagFilter tags={TAGS} active={activeTag} onSelect={setActiveTag} />
      </div>
      <main className="home-list">
        {loading && <p className="list-state">Loading…</p>}
        {!loading && items.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h2>No items yet</h2>
            <p>Start building your inventory by adding your first item.</p>
            <button className="empty-cta" onClick={() => navigate('add-item')}>+ Add First Item</button>
          </div>
        )}
        {!loading && items.length > 0 && filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h2>No results</h2>
            <p>Try a different search or tag filter.</p>
          </div>
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