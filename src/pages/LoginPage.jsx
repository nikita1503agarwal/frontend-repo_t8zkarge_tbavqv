import { useState } from 'react'
import { useApp } from '../App'
import { Link } from 'react-router-dom'

export default function LoginPage(){
  const { API_BASE, login } = useApp()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try{
      const res = await fetch(`${API_BASE}/auth/login`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({identifier, password})})
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail || 'Login failed')
      login(data.token, data.user)
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white/80 rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <div className='mb-3 text-red-600 text-sm'>{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border border-blue-200 rounded-lg p-2" placeholder="Email or Mobile" value={identifier} onChange={e=>setIdentifier(e.target.value)} />
        <input type="password" className="w-full border border-blue-200 rounded-lg p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-2 shadow hover:shadow-md transition">{loading?'Signing in...':'Login'}</button>
      </form>
      <p className='text-sm mt-3 text-blue-700/80'>New here? <Link to="/register" className='text-blue-700 underline'>Create an account</Link></p>
    </div>
  )
}
