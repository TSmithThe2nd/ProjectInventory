import { useState } from 'react'
import Home from './pages/Home'
import AddItem from './pages/AddItem'
import ItemDetail from './pages/ItemDetail'

function App() {
  const [page, setPage] = useState('home')
  const [selectedId, setSelectedId] = useState(null)

  const navigate = (target, id = null) => {
    setSelectedId(id)
    setPage(target)
  }

  return (
    <>
      {page === 'home' && <Home navigate={navigate} />}
      {page === 'add-item' && <AddItem navigate={navigate} />}
      {page === 'item-detail' && <ItemDetail itemId={selectedId} navigate={navigate} />}
    </>
  )
}

export default App