'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Package, MessageSquare, Image as ImageIcon, Mail, Home, Loader2, Trash2, Plus, Check, Edit3, Upload, X, Star, Search, Save, ExternalLink, RefreshCw } from 'lucide-react'
import api from '@/lib/api'

const TABS = [
  { key: 'packages', label: 'Tour Packages', icon: Package },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { key: 'gallery', label: 'Gallery', icon: ImageIcon },
  { key: 'enquiries', label: 'Enquiries', icon: Mail },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [tab, setTab] = useState('packages')

  useEffect(() => {
    const t = localStorage.getItem('sh_token')
    const a = localStorage.getItem('sh_admin')
    if (!t) { router.replace('/admin'); return }
    setToken(t)
    setAdmin(a ? JSON.parse(a) : null)
  }, [router])

  const logout = () => { localStorage.removeItem('sh_token'); localStorage.removeItem('sh_admin'); router.replace('/admin') }

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center sky-bg"><Loader2 className="w-6 h-6 animate-spin text-emerald-700"/></div>
  }

  return (
    <div className="min-h-screen sky-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-white/60">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/saishub-logo.png" alt="Saishub Holidays" className="h-10 w-auto"/>
          </Link>
          <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"/>
          <div className="font-display font-bold text-emerald-900 hidden md:block">Admin Dashboard</div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="text-xs md:text-sm text-slate-600 hover:text-emerald-800 flex items-center gap-1 px-3 py-2"><Home className="w-4 h-4"/> Site</Link>
            <button onClick={logout} className="text-xs md:text-sm text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-2"><LogOut className="w-4 h-4"/> Sign out</button>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(t => {
            const active = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${active ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-700 hover:bg-white/70'}`}>
                <t.icon className="w-4 h-4"/> {t.label}
              </button>
            )
          })}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {tab === 'packages' && <PackagesTab token={token}/>}
        {tab === 'testimonials' && <TestimonialsTab token={token}/>}
        {tab === 'gallery' && <GalleryTab token={token}/>}
        {tab === 'enquiries' && <EnquiriesTab token={token}/>}
      </main>
    </div>
  )
}

/* ---------------- PACKAGES ---------------- */
function PackagesTab({ token }) {
  const [items, setItems] = useState(null)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [q, setQ] = useState('')

  const load = useCallback(() => {
    setItems(null)
    api.getPackages({ active: 'all' }).then(d => setItems(d.packages || [])).catch(()=>setItems([]))
  }, [])
  useEffect(load, [load])

  const toggleActive = async (p) => {
    try {
      const res = await api.adminUpdatePackage(token, p.id, { isActive: !p.isActive })
      setItems(list => list.map(x => x.id === p.id ? res.package : x))
    } catch (e) { alert(e.message) }
  }

  const filtered = (items || []).filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <div className="tracking-[0.3em] text-xs text-amber-700 font-semibold uppercase">Manage</div>
          <h2 className="font-display text-3xl font-bold hero-gradient-text">Tour Packages</h2>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="pl-9 pr-3 py-2 rounded-full bg-white ring-1 ring-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"/>
          </div>
          <button onClick={load} className="p-2 rounded-full bg-white ring-1 ring-slate-200 hover:bg-slate-50" title="Refresh"><RefreshCw className="w-4 h-4"/></button>
        </div>
      </div>

      {items === null && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:6}).map((_,i)=><div key={i} className="h-40 rounded-2xl bg-white/70 animate-pulse"/>)}</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">{p.category}</div>
                <div className="font-display text-lg font-semibold text-emerald-900 mt-1">{p.name}</div>
                <div className="text-xs text-slate-500 mt-1">{p.duration} · from {p.startingLocation}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{p.isActive ? 'ACTIVE' : 'HIDDEN'}</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => setEditing(p)} className="px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-700 text-white hover:bg-emerald-800 flex items-center gap-1"><Edit3 className="w-3 h-3"/> Edit</button>
              <button onClick={() => toggleActive(p)} className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 flex items-center gap-1"><Check className="w-3 h-3"/> {p.isActive ? 'Deactivate' : 'Activate'}</button>
              <a href={`/packages/${p.id}`} target="_blank" rel="noreferrer" className="ml-auto text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1"><ExternalLink className="w-3 h-3"/> View</a>
            </div>
          </div>
        ))}
      </div>

      {editing && <PackageEditModal token={token} pkg={editing} onClose={() => setEditing(null)} onSaved={(updated) => { setItems(list => list.map(x => x.id === updated.id ? updated : x)); setEditing(null) }}/>}
    </div>
  )
}

function PackageEditModal({ token, pkg, onClose, onSaved }) {
  const [form, setForm] = useState({
    duration: pkg.duration || '',
    startingLocation: pkg.startingLocation || '',
    bestTimeToVisit: pkg.bestTimeToVisit || '',
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : '',
    inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : '',
    exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join('\n') : '',
    gallery: Array.isArray(pkg.gallery) ? pkg.gallery.join('\n') : '',
    itineraryJson: JSON.stringify(pkg.itinerary || [], null, 2),
    mapUrl: pkg.mapUrl || '',
    isActive: pkg.isActive,
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const save = async () => {
    setErr(''); setSaving(true)
    try {
      let itinerary
      try { itinerary = JSON.parse(form.itineraryJson) } catch { throw new Error('Itinerary must be valid JSON array') }
      const body = {
        duration: form.duration,
        startingLocation: form.startingLocation,
        bestTimeToVisit: form.bestTimeToVisit,
        highlights: form.highlights.split('\n').map(s => s.trim()).filter(Boolean),
        inclusions: form.inclusions.split('\n').map(s => s.trim()).filter(Boolean),
        exclusions: form.exclusions.split('\n').map(s => s.trim()).filter(Boolean),
        gallery: form.gallery.split('\n').map(s => s.trim()).filter(Boolean),
        itinerary,
        mapUrl: form.mapUrl || null,
        isActive: form.isActive,
      }
      const res = await api.adminUpdatePackage(token, pkg.id, body)
      onSaved(res.package)
    } catch (e) { setErr(e.message) } finally { setSaving(false) }
  }

  return (
    <Modal onClose={onClose} title={`Edit · ${pkg.name}`}>
      <div className="grid md:grid-cols-2 gap-4">
        <TextField label="Duration" value={form.duration} onChange={v => setForm(f => ({...f, duration: v}))}/>
        <TextField label="Starting Location" value={form.startingLocation} onChange={v => setForm(f => ({...f, startingLocation: v}))}/>
        <TextField label="Best Time to Visit" value={form.bestTimeToVisit} onChange={v => setForm(f => ({...f, bestTimeToVisit: v}))}/>
        <TextField label="Map URL" value={form.mapUrl} onChange={v => setForm(f => ({...f, mapUrl: v}))}/>
      </div>
      <TextArea label="Highlights (one per line)" value={form.highlights} onChange={v => setForm(f => ({...f, highlights: v}))} rows={4}/>
      <TextArea label="Inclusions (one per line)" value={form.inclusions} onChange={v => setForm(f => ({...f, inclusions: v}))} rows={3}/>
      <TextArea label="Exclusions (one per line)" value={form.exclusions} onChange={v => setForm(f => ({...f, exclusions: v}))} rows={3}/>
      <TextArea label="Gallery image URLs (one per line)" value={form.gallery} onChange={v => setForm(f => ({...f, gallery: v}))} rows={3}/>
      <TextArea label="Itinerary (JSON array)" value={form.itineraryJson} onChange={v => setForm(f => ({...f, itineraryJson: v}))} rows={10} mono/>
      <label className="flex items-center gap-2 text-sm mt-3">
        <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({...f, isActive: e.target.checked}))} className="w-4 h-4 accent-emerald-700"/>
        Active (visible on site)
      </label>
      {err && <div className="text-red-600 text-sm mt-3">{err}</div>}
      <div className="mt-6 flex gap-2 justify-end">
        <button onClick={onClose} className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-semibold">Cancel</button>
        <button disabled={saving} onClick={save} className="btn-primary rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2">{saving ? <>Saving <Loader2 className="w-4 h-4 animate-spin"/></> : <>Save <Save className="w-4 h-4"/></>}</button>
      </div>
    </Modal>
  )
}

/* ---------------- TESTIMONIALS ---------------- */
function TestimonialsTab({ token }) {
  const [items, setItems] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', rating: 5, message: '', location: '', isActive: true })
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setItems(null)
    fetch('/api/testimonials?all=true', { cache: 'no-store' }).then(r => r.json()).then(d => setItems(d.testimonials || [])).catch(()=>setItems([]))
  }, [])
  useEffect(load, [load])

  const add = async () => {
    if (!form.name || !form.message) return alert('Name and message required')
    setSaving(true)
    try {
      await api.adminCreateTestimonial(token, form)
      setForm({ name: '', rating: 5, message: '', location: '', isActive: true })
      setShowForm(false); load()
    } catch (e) { alert(e.message) } finally { setSaving(false) }
  }

  const toggle = async (t) => {
    try {
      await api.adminUpdateTestimonial(token, t.id, { isActive: !t.isActive })
      load()
    } catch (e) { alert(e.message) }
  }

  const del = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    try { await api.adminDeleteTestimonial(token, id); load() } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="tracking-[0.3em] text-xs text-amber-700 font-semibold uppercase">Manage</div>
          <h2 className="font-display text-3xl font-bold hero-gradient-text">Testimonials</h2>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4"/> Add</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 mb-6 grid md:grid-cols-2 gap-3">
          <TextField label="Name" value={form.name} onChange={v => setForm(f => ({...f, name: v}))}/>
          <TextField label="Location" value={form.location} onChange={v => setForm(f => ({...f, location: v}))}/>
          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Rating (1-5)</div>
            <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({...f, rating: Number(e.target.value)}))} className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"/>
          </label>
          <div/>
          <div className="md:col-span-2">
            <TextArea label="Message" value={form.message} onChange={v => setForm(f => ({...f, message: v}))} rows={3}/>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-semibold">Cancel</button>
            <button onClick={add} disabled={saving} className="btn-primary rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Save</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items === null && Array.from({length:6}).map((_,i)=><div key={i} className="h-40 rounded-2xl bg-white/70 animate-pulse"/>)}
        {items && items.map(t => (
          <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-emerald-900">{t.name}</div>
              <div className="flex text-amber-500">{Array.from({length: t.rating || 5}).map((_,k)=><Star key={k} className="w-3.5 h-3.5 fill-current"/>)}</div>
            </div>
            <div className="text-xs text-slate-500">{t.location || ''}</div>
            <p className="mt-3 text-sm text-slate-700 line-clamp-4">{t.message}</p>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => toggle(t)} className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200">{t.isActive ? 'Hide' : 'Show'}</button>
              <button onClick={() => del(t.id)} className="px-3 py-1.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"><Trash2 className="w-3 h-3"/> Delete</button>
              <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-full ${t.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{t.isActive ? 'ACTIVE' : 'HIDDEN'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- GALLERY ---------------- */
function GalleryTab({ token }) {
  const [items, setItems] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('General')

  const load = useCallback(() => {
    setItems(null)
    api.getGallery().then(d => setItems(d.gallery || [])).catch(()=>setItems([]))
  }, [])
  useEffect(load, [load])

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const up = await api.adminUpload(token, file)
      const publicUrl = `${window.location.origin}${up.url}`
      await api.adminCreateGallery(token, { imageUrl: publicUrl, category })
      load()
    } catch (e) { alert(e.message) } finally { setUploading(false); e.target.value = '' }
  }

  const del = async (id) => {
    if (!confirm('Remove this image from gallery?')) return
    try { await api.adminDeleteGallery(token, id); load() } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <div className="tracking-[0.3em] text-xs text-amber-700 font-semibold uppercase">Manage</div>
          <h2 className="font-display text-3xl font-bold hero-gradient-text">Gallery</h2>
        </div>
        <div className="flex items-center gap-2">
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 rounded-full bg-white ring-1 ring-slate-200 text-sm">
            <option>General</option>
            <option>Domestic</option>
            <option>International</option>
            <option>Pilgrimage</option>
          </select>
          <label className={`btn-primary rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin"/>Uploading…</> : <><Upload className="w-4 h-4"/> Upload Image</>}
            <input type="file" accept="image/*" onChange={onFile} className="hidden"/>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items === null && Array.from({length:8}).map((_,i)=><div key={i} className="aspect-square rounded-xl bg-white/70 animate-pulse"/>)}
        {items && items.map(g => (
          <div key={g.id} className="group relative rounded-xl overflow-hidden aspect-square bg-slate-100 ring-1 ring-slate-100">
            <img src={g.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover"/>
            {g.category && <span className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-emerald-800">{g.category}</span>}
            <button onClick={() => del(g.id)} className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- ENQUIRIES ---------------- */
function EnquiriesTab({ token }) {
  const [data, setData] = useState(null)

  const load = useCallback(() => {
    setData(null)
    api.adminEnquiries(token).then(setData).catch(()=>setData({ enquiries: [], total: 0 }))
  }, [token])
  useEffect(load, [load])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="tracking-[0.3em] text-xs text-amber-700 font-semibold uppercase">Inbox</div>
          <h2 className="font-display text-3xl font-bold hero-gradient-text">Enquiries</h2>
        </div>
        <button onClick={load} className="p-2 rounded-full bg-white ring-1 ring-slate-200 hover:bg-slate-50"><RefreshCw className="w-4 h-4"/></button>
      </div>
      {data === null && <div className="h-40 rounded-2xl bg-white/70 animate-pulse"/>}
      {data && (
        <>
          <div className="text-sm text-slate-500 mb-3">Total: <b>{data.total}</b></div>
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-500 uppercase text-[10px] tracking-widest">
                    <th className="px-4 py-3">When</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Travel</th>
                    <th className="px-4 py-3">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {data.enquiries.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-slate-400">No enquiries yet.</td></tr>}
                  {data.enquiries.map(e => (
                    <tr key={e.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{new Date(e.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-900">{e.name}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${e.phone}`} className="block text-emerald-700 hover:underline">{e.phone}</a>
                        {e.email && <a href={`mailto:${e.email}`} className="block text-xs text-slate-500 hover:underline">{e.email}</a>}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">{e.packageName || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">{e.travelDate || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 max-w-md">{e.message || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ---------------- UI primitives ---------------- */
function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="font-display text-xl font-bold text-emerald-900">{title}</div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
function TextField({ label, value, onChange, ...rest }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} {...rest} className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"/>
    </label>
  )
}
function TextArea({ label, value, onChange, rows = 3, mono = false }) {
  return (
    <label className="block mt-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className={`w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${mono ? 'font-mono text-xs' : ''}`}/>
    </label>
  )
}
