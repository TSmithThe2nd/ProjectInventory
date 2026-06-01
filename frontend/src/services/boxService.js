const BASE = '/api'

function authHeader() {
  const token = localStorage.getItem('auth_token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export async function getBoxes() {
  const res = await fetch(`${BASE}/boxes`, { headers: authHeader() })
  if (!res.ok) throw new Error('Failed to fetch boxes')
  return res.json()
}

export async function createBox(data) {
  const res = await fetch(`${BASE}/boxes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create box')
  return res.json()
}

export async function getBox(id) {
  const res = await fetch(`${BASE}/boxes/${id}`, { headers: authHeader() })
  if (!res.ok) throw new Error('Box not found')
  return res.json()
}

export async function updateBox(id, data) {
  const res = await fetch(`${BASE}/boxes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update box')
  return res.json()
}

export async function deleteBox(id) {
  const res = await fetch(`${BASE}/boxes/${id}`, { method: 'DELETE', headers: authHeader() })
  if (!res.ok) throw new Error('Failed to delete box')
  return res.json()
}
