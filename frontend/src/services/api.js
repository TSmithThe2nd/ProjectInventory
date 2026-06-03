export const BASE = '/api'

export function getAuthToken() {
  return localStorage.getItem('auth_token')
}

export function authHeader() {
  const token = getAuthToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...options.headers, ...authHeader() },
  })
  if (res.status === 401) {
    localStorage.removeItem('auth_token')
    window.location.href = '/api/auth/login'
    return new Promise(() => {})
  }
  return res
}