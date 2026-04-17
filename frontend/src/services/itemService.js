const BASE = 'http://localhost:5000/api'

export async function getItems() {
  const res = await fetch(`${BASE}/items`)
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

export async function createItem(data) {
  const res = await fetch(`${BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create item')
  return res.json()
}

export async function getItem(id) {
  const res = await fetch(`${BASE}/items/${id}`)
  if (!res.ok) throw new Error('Item not found')
  return res.json()
}