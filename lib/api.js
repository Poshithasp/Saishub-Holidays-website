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

  // ADMIN
  login: (username, password) => fetch('/api/admin/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }),
  }).then(handle),

  adminEnquiries: (token) => fetch('/api/admin/enquiries', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }).then(handle),

  adminUpload: (token, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd }).then(handle)
  },

  // Packages
  adminCreatePackage: (token, body) => fetch('/api/admin/packages', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
  }).then(handle),
  adminUpdatePackage: (token, id, body) => fetch(`/api/admin/packages/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
  }).then(handle),
  adminDeletePackage: (token, id) => fetch(`/api/admin/packages/${id}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
  }).then(handle),

  // Testimonials
  adminCreateTestimonial: (token, body) => fetch('/api/admin/testimonials', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
  }).then(handle),
  adminUpdateTestimonial: (token, id, body) => fetch(`/api/admin/testimonials/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
  }).then(handle),
  adminDeleteTestimonial: (token, id) => fetch(`/api/admin/testimonials/${id}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
  }).then(handle),

  // Gallery
  adminCreateGallery: (token, body) => fetch('/api/admin/gallery', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
  }).then(handle),
  adminDeleteGallery: (token, id) => fetch(`/api/admin/gallery/${id}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
  }).then(handle),
}

export default api
