import { useEffect, useState } from 'react'
import { useApp } from '../App'
import { Link, useNavigate } from 'react-router-dom'

export default function CartPage(){
  const { cart, removeFromCart, API_BASE, token } = useApp()
  const [pricing, setPricing] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    if(cart.length===0){ setPricing({items:[], subtotal:0, platform_fee:10, delivery_fee:0, total:10}); return }
    const fetchPrice = async ()=>{
      const res = await fetch(`${API_BASE}/price/compute`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(cart)})
      const data = await res.json(); setPricing(data)
    }
    fetchPrice()
  },[cart])

  if(cart.length===0){
    return (
      <div className='text-center space-y-3'>
        <p>Your cart is empty.</p>
        <Link to='/' className='inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg'>Browse products</Link>
      </div>
    )
  }

  return (
    <div className='grid md:grid-cols-3 gap-4'>
      <div className='md:col-span-2 space-y-3'>
        {cart.map((it, idx)=> (
          <div key={idx} className='p-3 rounded-lg bg-white/80 border border-blue-100 flex items-start justify-between gap-3'>
            <div>
              <div className='font-semibold capitalize'>{it.product.replace('_',' ')}</div>
              <div className='text-sm text-blue-700/70'>Options: {Object.entries(it.options||{}).map(([k,v])=> `${k}:${v}`).join(', ')}</div>
            </div>
            <button onClick={()=>removeFromCart(idx)} className='text-sm text-blue-700 underline'>Remove</button>
          </div>
        ))}
      </div>
      <div className='space-y-3'>
        <div className='p-4 rounded-lg bg-white/90 border border-blue-100'>
          <h3 className='font-semibold mb-2'>Price Summary</h3>
          {pricing ? (
            <div className='space-y-1 text-sm'>
              <div className='flex justify-between'><span>Items Subtotal</span><span>₹{pricing.subtotal?.toFixed(2)}</span></div>
              <div className='flex justify-between'><span>Platform Fee</span><span>₹{pricing.platform_fee}</span></div>
              <div className='flex justify-between'><span>Delivery Fee</span><span>₹{pricing.delivery_fee}</span></div>
              <div className='border-t border-blue-100 pt-2 flex justify-between font-semibold'><span>Order Total</span><span>₹{pricing.total?.toFixed(2)}</span></div>
            </div>
          ): <div>Calculating...</div>}
          <button onClick={()=> navigate('/checkout')} className='mt-3 w-full bg-blue-600 text-white rounded-lg py-2'>Checkout ₹{pricing?.total?.toFixed(2) || 0}</button>
        </div>
      </div>
    </div>
  )
}
