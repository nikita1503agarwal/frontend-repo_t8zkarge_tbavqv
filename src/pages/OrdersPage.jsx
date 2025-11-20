import { useEffect, useState } from 'react'
import { useApp } from '../App'

export default function OrdersPage(){
  const { API_BASE, token } = useApp()
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    if(!token) return
    fetch(`${API_BASE}/orders?token=${token}`).then(r=>r.json()).then(data=> setOrders(data.orders||[])).catch(()=>{})
  },[token])

  if(!token){
    return <div className='text-center'>Login to view your orders.</div>
  }

  return (
    <div className='space-y-3'>
      <h2 className='text-xl font-semibold'>Your Orders</h2>
      {orders.length===0 ? <p className='text-blue-700/70'>No orders yet.</p> : orders.map(o => (
        <div key={o.id} className='p-4 rounded-lg bg-white/80 border border-blue-100'>
          <div className='flex justify-between'>
            <div>
              <div className='font-semibold'>Order #{(o.id||'').slice(-6)}</div>
              <div className='text-sm text-blue-700/70'>Status: {o.status}</div>
            </div>
            <div className='text-right'>
              <div className='font-semibold'>₹{(typeof o.total==='number'? o.total.toFixed(2): o.total)}</div>
              {o.whatsapp_link && <a className='text-blue-700 underline text-sm' href={o.whatsapp_link} target='_blank'>WhatsApp confirmation</a>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
