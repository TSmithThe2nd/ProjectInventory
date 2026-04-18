import { useState, useEffect } from 'react'
import Home from './pages/Home'
import AddItem from './pages/AddItem'
import ItemDetail from './pages/ItemDetail'

function App() {
  const [page, setPage] = useState('home')
  const [selectedId, setSelectedId] = useState(null)
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const navigate = (target, id = null) => {
    setSelectedId(id)
    setPage(target)
  }

  return (
    <>
      {offline && (
        <div style={{
          background: '#92400e', color: '#fef3c7', textAlign: 'center',
          padding: '8px 16px', fontSize: '14px', fontWeight: 500,
        }}>
          You're offline — showing cached inventory
        </div>
      )}
      {page === 'home' && <Home navigate={navigate} />}
      {page === 'add-item' && <AddItem navigate={navigate} />}
      {page === 'item-detail' && <ItemDetail itemId={selectedId} navigate={navigate} />}
    </>
  )
}

export default App