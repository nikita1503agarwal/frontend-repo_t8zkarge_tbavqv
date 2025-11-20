import { useEffect, useMemo, useState, createContext, useContext } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Home, ShoppingCart, User, Package, FolderOpen, LogOut, Phone, FileText, CupSoda, Printer, Layers, Megaphone } from 'lucide-react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import ProductPage from './pages/ProductPage'
import './index.css'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// ---------------- Contexts ----------------
const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

function AppProvider({ children }) {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([]) // array of CartItem-like

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/me?token=${token}`).then(r => r.json()).then(data => {
        if (data && data.id) setUser(data)
      }).catch(() => {})
    }
  }, [token])

  const login = (t, u) => {
    localStorage.setItem('token', t)
    setToken(t)
    setUser(u)
    navigate('/')
  }
  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
    setCart([])
    navigate('/')
  }

  const addToCart = (item) => {
    if (!token) {
      navigate('/login')
      return
    }
    setCart(prev => [...prev, item])
  }
  const removeFromCart = (idx) => setCart(prev => prev.filter((_, i) => i !== idx))
  const clearCart = () => setCart([])

  const value = useMemo(() => ({ API_BASE, token, user, login, logout, cart, addToCart, removeFromCart, clearCart, setCart }), [API_BASE, token, user, cart])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// ---------------- UI Shell ----------------
function TopBar() {
  const { cart, user } = useApp()
  const totalItems = cart.length
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white grid place-items-center shadow"><Printer size={18}/></div>
          <span className="font-semibold text-blue-900">BluePrints</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-blue-700 hover:text-blue-900 transition">
            <ShoppingCart />
            {totalItems > 0 && <span className="absolute -top-2 -right-2 text-xs bg-blue-600 text-white rounded-full w-5 h-5 grid place-items-center">{totalItems}</span>}
          </Link>
          <Link to={user ? '/profile' : '/login'} className="text-blue-700 hover:text-blue-900 transition">
            <User />
          </Link>
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  const { cart } = useApp()
  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden bg-white/90 backdrop-blur border-t border-blue-100 z-30">
      <div className="max-w-6xl mx-auto grid grid-cols-5 text-sm text-blue-700">
        <Link to="/" className="py-2 flex flex-col items-center gap-1"><Home size={20}/>Home</Link>
        <Link to="/categories" className="py-2 flex flex-col items-center gap-1"><FolderOpen size={20}/>Categories</Link>
        <Link to="/cart" className="py-2 flex flex-col items-center gap-1 relative"><ShoppingCart size={20}/>{cart.length>0 && <span className='absolute top-0 right-6 text-[10px] bg-blue-600 text-white rounded-full w-4 h-4 grid place-items-center'>{cart.length}</span>}Cart</Link>
        <Link to="/orders" className="py-2 flex flex-col items-center gap-1"><Package size={20}/>Orders</Link>
        <Link to="/profile" className="py-2 flex flex-col items-center gap-1"><User size={20}/>Profile</Link>
      </div>
    </nav>
  )}

function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-blue-900">
      <TopBar />
      <main className="max-w-6xl mx-auto p-4 pb-24">
        <Routes>
          <Route index element={<HomePage/>} />
          <Route path="/categories" element={<HomePage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/checkout" element={<CheckoutPage/>} />
          <Route path="/orders" element={<OrdersPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/product/:slug" element={<ProductPage/>} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  )
}
