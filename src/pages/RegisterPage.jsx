import { useState } from 'react'
import { useApp } from '../App'

export default function RegisterPage(){
  const { API_BASE, login } = useApp()
  const [form, setForm] = useState({full_name:'', mobile:'', email:'', password:'', address_line:'', city:'', pincode:''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e)=> setForm(prev=>({...prev,[e.target.name]: e.target.value}))

  const onSubmit = async (e)=>{
    e.preventDefault(); setLoading(true); setError('')
    try{
      const res = await fetch(`${API_BASE}/auth/register`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail || 'Registration failed')
      login(data.token, data.user)
    }catch(err){ setError(err.message) }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-lg mx-auto bg-white/80 rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Create your account</h2>
      {error && <div className='mb-3 text-red-600 text-sm'>{error}</div>}
      <form onSubmit={onSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <input className='border border-blue-200 rounded-lg p-2' placeholder='Full Name' name='full_name' value={form.full_name} onChange={onChange} />
        <input className='border border-blue-200 rounded-lg p-2' placeholder='Mobile' name='mobile' value={form.mobile} onChange={onChange} />
        <input className='border border-blue-200 rounded-lg p-2 md:col-span-2' placeholder='Email' name='email' value={form.email} onChange={onChange} />
        <input type='password' className='border border-blue-200 rounded-lg p-2 md:col-span-2' placeholder='Password' name='password' value={form.password} onChange={onChange} />
        <input className='border border-blue-200 rounded-lg p-2 md:col-span-2' placeholder='Address Line' name='address_line' value={form.address_line} onChange={onChange} />
        <input className='border border-blue-200 rounded-lg p-2' placeholder='City' name='city' value={form.city} onChange={onChange} />
        <input className='border border-blue-200 rounded-lg p-2' placeholder='Pincode' name='pincode' value={form.pincode} onChange={onChange} />
        <button disabled={loading} className='bg-blue-600 text-white rounded-lg py-2 shadow hover:shadow-md transition md:col-span-2'>{loading?'Creating...':'Register'}</button>
      </form>
    </div>
  )
}
