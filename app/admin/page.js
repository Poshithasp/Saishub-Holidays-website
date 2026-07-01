'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    // If already logged in, jump to dashboard
    if (typeof window !== 'undefined' && localStorage.getItem('sh_token')) {
      router.replace('/admin/dashboard')
    }
  }, [router])

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      const res = await api.login(username, password)
      localStorage.setItem('sh_token', res.token)
      localStorage.setItem('sh_admin', JSON.stringify(res.admin))
      // Also set cookie client-side so middleware picks it up on the next request
      const week = 7 * 24 * 60 * 60
      document.cookie = `sh_token=${res.token}; path=/; max-age=${week}; SameSite=Lax; Secure`
      router.replace('/admin/dashboard')
    } catch (e) {
      setErr(e.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen sky-bg relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-100/60 to-transparent blur-3xl"/>
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-200/40 to-transparent blur-3xl"/>

      <div className="relative glass rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl">
        <Link href="/" className="inline-block">
          <img src="/saishub-logo.png" alt="Saishub Holidays" className="h-14 w-auto object-contain"/>
        </Link>
        <div className="mt-6">
          <div className="tracking-[0.3em] text-xs text-amber-700 font-semibold uppercase">Admin Panel</div>
          <h1 className="mt-2 font-display text-4xl font-bold hero-gradient-text">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Manage packages, testimonials, gallery and enquiries.</p>
        </div>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Username</div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
              <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full rounded-2xl bg-white/90 border border-white px-9 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="admin" required/>
            </div>
          </label>
          <label className="block">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Password</div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-2xl bg-white/90 border border-white px-9 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" required/>
            </div>
          </label>
          {err && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle className="w-4 h-4"/>{err}</div>}
          <button type="submit" disabled={loading} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold flex items-center justify-center gap-2 w-full disabled:opacity-70">
            {loading ? <>Signing in <Loader2 className="w-4 h-4 animate-spin"/></> : <>Sign in <ArrowRight className="w-4 h-4"/></>}
          </button>
          <div className="text-xs text-slate-500 text-center pt-2">Default: admin / admin123</div>
        </form>
      </div>
    </div>
  )
}
