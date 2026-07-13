// Client-side API helper (works from both client and server components)
// All paths are relative so they hit the same-origin /api routes.

async function handle(res) {
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json() : await res.text()
  if (!res.ok) {
    const err = new Error((data && data.error) || `HTTP ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  // PUBLIC
  getPackages: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return fetch(`/api/packages${q ? `?${q}` : ''}`, { cache: 'no-store' }).then(handle)
  },
  getPackage: (id) => fetch(`/api/packages/${id}`, { cache: 'no-store' }).then(handle),
  getTestimonials: (all = false) => fetch(`/api/testimonials${all ? '?all=true' : ''}`, { cache: 'no-store' }).then(handle),
  getGallery: (category) => fetch(`/api/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`, { cache: 'no-store' }).then(handle),
  postEnquiry: (body) => fetch('/api/enquiry', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }).then(handle),

  // ADMIN — auth is carried by the HttpOnly `sh_token` cookie, which the
  // browser sends automatically on these same-origin requests. No token is
  // ever handled in JavaScript.
  login: (username, password) => fetch('/api/admin/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ username, password }),
  }).then(handle),

  logout: () => fetch('/api/admin/login', { method: 'DELETE', credentials: 'include' }).then(handle),

  adminEnquiries: () => fetch('/api/admin/enquiries', { credentials: 'include', cache: 'no-store' }).then(handle),

  adminUpload: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return fetch('/api/admin/upload', { method: 'POST', credentials: 'include', body: fd }).then(handle)
  },

  // Packages
  adminCreatePackage: (body) => fetch('/api/admin/packages', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body),
  }).then(handle),
  adminUpdatePackage: (id, body) => fetch(`/api/admin/packages/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body),
  }).then(handle),
  adminDeletePackage: (id) => fetch(`/api/admin/packages/${id}`, {
    method: 'DELETE', credentials: 'include',
  }).then(handle),

  // Testimonials
  adminCreateTestimonial: (body) => fetch('/api/admin/testimonials', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body),
  }).then(handle),
  adminUpdateTestimonial: (id, body) => fetch(`/api/admin/testimonials/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body),
  }).then(handle),
  adminDeleteTestimonial: (id) => fetch(`/api/admin/testimonials/${id}`, {
    method: 'DELETE', credentials: 'include',
  }).then(handle),

  // Gallery
  adminCreateGallery: (body) => fetch('/api/admin/gallery', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body),
  }).then(handle),
  adminDeleteGallery: (id) => fetch(`/api/admin/gallery/${id}`, {
    method: 'DELETE', credentials: 'include',
  }).then(handle),
}

export default api
