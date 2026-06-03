import { BASE, authFetch } from './api'

export async function getBoxes() {
  const res = await authFetch(`${BASE}/boxes`)
  if (!res.ok) throw new Error('Failed to fetch boxes')
  return res.json()
}

export async function createBox(data) {
  const res = await authFetch(`${BASE}/boxes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create box')
  return res.json()
}

export async function getBox(id) {
  const res = await authFetch(`${BASE}/boxes/${id}`)
  if (!res.ok) throw new Error('Box not found')
  return res.json()
}

export async function updateBox(id, data) {
  const res = await authFetch(`${BASE}/boxes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update box')
  return res.json()
}

export async function deleteBox(id) {
  const res = await authFetch(`${BASE}/boxes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete box')
  return res.json()
}
