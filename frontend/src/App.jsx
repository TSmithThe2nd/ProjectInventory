import { useState, useEffect } from 'react'
import Home from './pages/Home'
import AddItem from './pages/AddItem'
import ItemDetail from './pages/ItemDetail'

function App() {
  const [page, setPage] = useState('home')
  const [selectedId, setSelectedId] = useState(null)
  const [offline, setOffline] = useState(!navigator.onLine)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Pick up token from URL after OAuth redirect
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem('auth_token', urlToken)
      window.history.replaceState({}, '', '/')
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      window.location.href = '/api/auth/login'
      return
    }

    fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          localStorage.removeItem('auth_token')
          window.location.href = '/api/auth/login'
        } else {
          setAuthChecked(true)
        }
      })
      .catch(() => setAuthChecked(true))
  }, [])

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

  if (!authChecked) return null

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
      {page === 'home' && <Home navigate={navigate} offline={offline} />}
      {page === 'add-item' && <AddItem navigate={navigate} />}
      {page === 'item-detail' && <ItemDetail itemId={selectedId} navigate={navigate} />}
    </>
  )
}

export default App
