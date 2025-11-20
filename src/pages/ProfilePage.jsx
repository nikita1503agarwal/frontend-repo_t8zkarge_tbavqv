import { useApp } from '../App'

export default function ProfilePage(){
  const { user, logout } = useApp()
  if(!user){
    return <div className='text-center'>Login to view your profile.</div>
  }
  const a = user.addresses?.[0]
  return (
    <div className='max-w-lg mx-auto bg-white/80 rounded-xl p-6 shadow space-y-3'>
      <div>
        <div className='text-sm text-blue-700/70'>Name</div>
        <div className='font-semibold'>{user.full_name}</div>
      </div>
      <div>
        <div className='text-sm text-blue-700/70'>Contact</div>
        <div>{user.mobile} • {user.email}</div>
      </div>
      {a && <div>
        <div className='text-sm text-blue-700/70'>Default Address</div>
        <div>{a.address_line}, {a.city} - {a.pincode}</div>
      </div>}
      <button onClick={logout} className='px-4 py-2 bg-blue-600 text-white rounded-lg'>Logout</button>
    </div>
  )
}
