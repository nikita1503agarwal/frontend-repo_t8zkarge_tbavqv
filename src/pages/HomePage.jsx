import { Link } from 'react-router-dom'
import { FileText, Briefcase, Layers, Megaphone, CupSoda } from 'lucide-react'

const categories = [
  { slug: 'document-printing', title: 'Document Printing', icon: FileText, desc: 'Black & White or Colour prints, A4/A3, multiple files' },
  { slug: 'business-stationery', title: 'Business Stationery', icon: Briefcase, desc: 'Visiting Cards, Letterheads, Envelopes' },
  { slug: 'bindings-finishing', title: 'Bindings & Finishing', icon: Layers, desc: 'Spiral binding, laminations as add-ons' },
  { slug: 'marketing-prints', title: 'Marketing Prints', icon: Megaphone, desc: 'Flyers and Posters' },
  { slug: 'custom-mugs', title: 'Custom Mugs', icon: CupSoda, desc: 'Personalized ceramic mugs' },
]

export default function HomePage(){
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Fast, friendly online printing</h1>
        <p className="text-blue-700/80">Smooth, mobile-first ordering experience</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <Link key={cat.slug} to={`/product/${cat.slug}`} className="group p-4 rounded-xl bg-white/80 hover:bg-white transition border border-blue-100 shadow-sm hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white grid place-items-center shadow"><cat.icon size={20}/></div>
              <div>
                <h3 className="font-semibold group-hover:text-blue-900">{cat.title}</h3>
                <p className="text-sm text-blue-700/70">{cat.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link to="/login" className="inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:shadow-md transition">Login / Register to Start</Link>
      </div>
    </div>
  )
}
