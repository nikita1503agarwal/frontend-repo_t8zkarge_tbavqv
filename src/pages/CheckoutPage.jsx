import { useState, useEffect } from 'react'
import { useApp } from '../App'
import { useNavigate } from 'react-router-dom'

export default function CheckoutPage(){
  const { API_BASE, token, user, cart, clearCart } = useApp()
  const [pricing, setPricing] = useState(null)
  const [address, setAddress] = useState(user?.addresses?.[0] || {address_line:'', city:'', pincode:'', label:'Home', is_default:true})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    const compute = async ()=>{
      const res = await fetch(`${API_BASE}/price/compute`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(cart)})
      const data = await res.json(); setPricing(data)
    }
    compute()
  },[cart])

  const placeOrder = async ()=>{
    if(!token){ navigate('/login'); return }
    setLoading(true)
    try{
      const res = await fetch(`${API_BASE}/orders`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({items: cart, address, payment_method: 'cod', token})})
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail || 'Order failed')
      clearCart()
      navigate(`/orders?placed=${data.order_id}`, { state: data })
    }catch(err){ setMessage(err.message) } finally{ setLoading(false) }
  }

  return (
    <div className='grid md:grid-cols-3 gap-4'>
      <div className='md:col-span-2 space-y-3'>
        <div className='p-4 rounded-lg bg-white/80 border border-blue-100'>
          <h3 className='font-semibold mb-2'>Delivery Address</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <input className='border border-blue-200 rounded-lg p-2 md:col-span-3' placeholder='Address Line' value={address.address_line} onChange={e=>setAddress({...address, address_line: e.target.value})}/>
            <input className='border border-blue-200 rounded-lg p-2' placeholder='City' value={address.city} onChange={e=>setAddress({...address, city: e.target.value})}/>
            <input className='border border-blue-200 rounded-lg p-2' placeholder='Pincode' value={address.pincode} onChange={e=>setAddress({...address, pincode: e.target.value})}/>
          </div>
        </div>
      </div>
      <div className='space-y-3'>
        <div className='p-4 rounded-lg bg-white/90 border border-blue-100'>
          <h3 className='font-semibold mb-2'>Order Summary</h3>
          {pricing ? (
            <div className='space-y-1 text-sm'>
              <div className='flex justify-between'><span>Items Subtotal</span><span>₹{pricing.subtotal?.toFixed(2)}</span></div>
              <div className='flex justify-between'><span>Platform Fee</span><span>₹{pricing.platform_fee}</span></div>
              <div className='flex justify-between'><span>Delivery Fee</span><span>₹{pricing.delivery_fee}</span></div>
              <div className='border-t border-blue-100 pt-2 flex justify-between font-semibold'><span>Total</span><span>₹{pricing.total?.toFixed(2)}</span></div>
              {pricing.contains_office_visiting_cards && <p className='text-xs text-blue-700/70 mt-2'>We’ll confirm your office visiting card design with you on WhatsApp before printing.</p>}
            </div>
          ): <div>Calculating...</div>}
          <button disabled={loading} onClick={placeOrder} className='mt-3 w-full bg-blue-600 text-white rounded-lg py-2'>{loading?'Placing...':`Place Order ₹${pricing?.total?.toFixed(2) || 0}`}</button>
          {message && <p className='text-sm text-red-600 mt-2'>{message}</p>}
        </div>
      </div>
    </div>
  )
}
