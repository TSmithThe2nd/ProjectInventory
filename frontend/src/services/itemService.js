import { BASE, authFetch, getAuthToken } from './api'

export function authImageUrl(url) {
  if (!url || !url.startsWith('/api/image/')) return url
  const token = getAuthToken()
  return token ? `${url}?token=${encodeURIComponent(token)}` : url
}

export async function getItems() {
  try {
    const res = await authFetch(`${BASE}/items`)
    if (!res.ok) throw new Error('Failed to fetch items')
    const data = await res.json()
    localStorage.setItem('cached_items', JSON.stringify(data))
    return data
  } catch (err) {
    const cached = localStorage.getItem('cached_items')
    if (cached) return JSON.parse(cached)
    throw err
  }
}

export async function createItem(data) {
  const res = await authFetch(`${BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create item')
  return res.json()
}

export async function getItem(id) {
  const res = await authFetch(`${BASE}/items/${id}`)
  if (!res.ok) throw new Error('Item not found')
  return res.json()
}

export async function uploadPhoto(file) {
  const body = new FormData()
  body.append('photo', file)
  const res = await authFetch(`${BASE}/upload`, { method: 'POST', body })
  if (!res.ok) throw new Error('Failed to upload photo')
  return res.json()
}

export async function updateItem(id, data) {
  const res = await authFetch(`${BASE}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update item')
  return res.json()
}

export async function deleteItem(id) {
  const res = await authFetch(`${BASE}/items/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete item')
  return res.json()
}
