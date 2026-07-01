'use client'
import { useState } from 'react'
import { Plus, X, GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

// Structured, drag-order-friendly itinerary editor.
// Value shape: [{ day: number, title: string, activities: string[] }]
export default function ItineraryEditor({ value = [], onChange }) {
  const days = Array.isArray(value) ? value : []

  const update = (next) => {
    // Renumber days consecutively 1..n
    onChange(next.map((d, i) => ({ ...d, day: i + 1 })))
  }

  const addDay = () => {
    update([...days, { day: days.length + 1, title: '', activities: [''] }])
  }
  const removeDay = (idx) => update(days.filter((_, i) => i !== idx))
  const moveDay = (idx, dir) => {
    const j = idx + dir
    if (j < 0 || j >= days.length) return
    const next = [...days]
    ;[next[idx], next[j]] = [next[j], next[idx]]
    update(next)
  }

  const setTitle = (idx, title) => {
    const next = [...days]
    next[idx] = { ...next[idx], title }
    update(next)
  }
  const setActivity = (idx, aIdx, v) => {
    const next = [...days]
    const acts = [...(next[idx].activities || [])]
    acts[aIdx] = v
    next[idx] = { ...next[idx], activities: acts }
    update(next)
  }
  const addActivity = (idx) => {
    const next = [...days]
    next[idx] = { ...next[idx], activities: [...(next[idx].activities || []), ''] }
    update(next)
  }
  const removeActivity = (idx, aIdx) => {
    const next = [...days]
    next[idx] = { ...next[idx], activities: (next[idx].activities || []).filter((_, i) => i !== aIdx) }
    update(next)
  }

  return (
    <div className="space-y-3">
      {days.length === 0 && (
        <div className="text-center text-slate-400 text-sm py-6 border border-dashed border-slate-300 rounded-2xl">No days yet — click “Add day” to build your itinerary.</div>
      )}

      {days.map((d, idx) => (
        <div key={idx} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">Day {d.day || idx + 1}</div>
            <input
              value={d.title || ''}
              onChange={(e) => setTitle(idx, e.target.value)}
              placeholder="e.g. Bengaluru → Mysore"
              className="flex-1 rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center gap-1 shrink-0">
              <button type="button" onClick={() => moveDay(idx, -1)} disabled={idx === 0} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronUp className="w-4 h-4"/></button>
              <button type="button" onClick={() => moveDay(idx, 1)} disabled={idx === days.length - 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronDown className="w-4 h-4"/></button>
              <button type="button" onClick={() => removeDay(idx)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" title="Delete day"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>

          <div className="mt-3 space-y-2 pl-10">
            {(d.activities || []).map((a, aIdx) => (
              <div key={aIdx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"/>
                <input
                  value={a}
                  onChange={(e) => setActivity(idx, aIdx, e.target.value)}
                  placeholder="Activity or landmark"
                  className="flex-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="button" onClick={() => removeActivity(idx, aIdx)} className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"><X className="w-4 h-4"/></button>
              </div>
            ))}
            <button type="button" onClick={() => addActivity(idx)} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 ml-3.5"><Plus className="w-3 h-3"/> Add activity</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addDay} className="w-full rounded-2xl border-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 py-3 text-sm font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> Add day</button>
    </div>
  )
}
