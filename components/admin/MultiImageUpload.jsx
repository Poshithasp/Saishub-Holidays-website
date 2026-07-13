'use client'
import { useCallback, useRef, useState } from 'react'
import { UploadCloud, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import api from '@/lib/api'

// Multi-file drag-drop uploader for the gallery.
// - Accepts multiple images via drag-drop or file picker
// - Uploads them sequentially via /api/admin/upload
// - Creates a matching Gallery row for each via /api/admin/gallery
// - Emits progress per file
//
// Props: { category, onDone(count) }  — auth via HttpOnly cookie
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export default function MultiImageUpload({ category = 'General', onDone }) {
  const [items, setItems] = useState([]) // [{file, id, status, url, error}]
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList).filter(f => ACCEPTED_TYPES.has(f.type))
    if (files.length === 0) return
    setItems(prev => [...prev, ...files.map(f => ({ file: f, id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`, status: 'queued' }))])
  }, [])

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const onFilePick = (e) => addFiles(e.target.files)

  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const upload = async () => {
    const queued = items.filter(i => i.status === 'queued')
    let done = 0
    for (const it of queued) {
      setItems(prev => prev.map(i => i.id === it.id ? { ...i, status: 'uploading' } : i))
      try {
        const up = await api.adminUpload(it.file)
        const publicUrl = `${window.location.origin}${up.url}`
        await api.adminCreateGallery({ imageUrl: publicUrl, category })
        setItems(prev => prev.map(i => i.id === it.id ? { ...i, status: 'done', url: publicUrl } : i))
        done++
      } catch (err) {
        setItems(prev => prev.map(i => i.id === it.id ? { ...i, status: 'error', error: err.message } : i))
      }
    }
    onDone && onDone(done)
  }

  const clearDone = () => setItems(prev => prev.filter(i => i.status !== 'done'))

  const anyQueued = items.some(i => i.status === 'queued')
  const anyDone = items.some(i => i.status === 'done')

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${dragOver ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/50'}`}
      >
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={onFilePick}/>
        <UploadCloud className="w-10 h-10 mx-auto text-emerald-700"/>
        <div className="mt-3 font-semibold text-emerald-900">Drop images here, or click to choose</div>
        <div className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP, GIF — up to 8MB each. Multi-select supported.</div>
      </div>

      {items.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map(it => (
              <div key={it.id} className="relative rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 aspect-square">
                <img src={it.url || URL.createObjectURL(it.file)} alt="" className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[11px] px-2 py-1 truncate">{it.file.name}</div>
                <div className="absolute top-1.5 left-1.5">
                  {it.status === 'queued' && <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-white text-slate-700">QUEUED</span>}
                  {it.status === 'uploading' && <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1"><Loader2 className="w-2.5 h-2.5 animate-spin"/> UPLOADING</span>}
                  {it.status === 'done' && <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5"/> DONE</span>}
                  {it.status === 'error' && <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-red-100 text-red-800 flex items-center gap-1" title={it.error}><AlertCircle className="w-2.5 h-2.5"/> FAIL</span>}
                </div>
                {it.status !== 'uploading' && (
                  <button onClick={(e) => { e.stopPropagation(); remove(it.id) }} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600"><X className="w-3 h-3"/></button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={upload} disabled={!anyQueued} className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              <UploadCloud className="w-4 h-4"/> Upload {items.filter(i => i.status === 'queued').length} file(s)
            </button>
            {anyDone && <button onClick={clearDone} className="px-4 py-2 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200">Clear done</button>}
            <div className="ml-auto text-xs text-slate-500">{items.length} file(s) selected · {items.filter(i => i.status==='done').length} uploaded</div>
          </div>
        </>
      )}
    </div>
  )
}
