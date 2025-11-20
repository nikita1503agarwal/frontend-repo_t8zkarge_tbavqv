import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../App'

export default function ProductPage(){
  const { slug } = useParams()
  const { addToCart, API_BASE, token } = useApp()
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)

  const [doc, setDoc] = useState({ color:'bw', size:'A4', gsm:80, sides:'single', pages:1 })
  const [visit, setVisit] = useState({ card_type:'personal', paper:'economy_250_matte', quantity:50, design:'ready_design' })
  const [letter, setLetter] = useState({ gsm:100, quantity:100, design:'ready_design' })
  const [env, setEnv] = useState({ type:'standard_80', size:'DL', quantity:100 })
  const [flyer, setFlyer] = useState({ size:'A5', gsm:130, quantity:50 })
  const [poster, setPoster] = useState({ size:'A3', gsm:170, quantity:1 })
  const [mug, setMug] = useState({ print_area:'one_side', quantity:1, text:'' })
  const [addons, setAddons] = useState({ spiral_binding: null, lamination: null })

  const handleUpload = async (event)=>{
    if(!token){ window.location.href='/login'; return }
    const sel = Array.from(event.target.files||[])
    if(sel.length===0) return
    setBusy(true)
    const form = new FormData()
    sel.forEach(f=> form.append('files', f))
    form.append('token', token)
    const res = await fetch(`${API_BASE}/upload?token=${token}`, { method:'POST', body: form })
    const data = await res.json()
    setFiles(prev => [...prev, ...(data.files||[])])
    setBusy(false)
  }

  const addItem = ()=>{
    let product = ''
    let options = {}
    if(slug==='document-printing'){
      product = 'document_printing'; options = {...doc, files, sides: doc.sides}
    }else if(slug==='business-stationery'){
      product = 'visiting_cards'; options = {...visit, files}
    }else if(slug==='marketing-prints'){
      product = 'flyers'; options = {...flyer, files}
    }else if(slug==='custom-mugs'){
      product = 'custom_mug'; options = {...mug, images: files}
    }else if(slug==='bindings-finishing'){
      // not standalone
      alert('Bindings are available as add-ons inside Document Printing.')
      return
    }
    addToCart({ product, options, addons, quantity: 1 })
    window.history.back()
  }

  const Section = ({children}) => <div className='p-4 rounded-xl bg-white/80 border border-blue-100 shadow-sm space-y-3'>{children}</div>
  const Label = ({children}) => <div className='text-sm text-blue-700/70'>{children}</div>
  const Select = (props) => <select {...props} className='border border-blue-200 rounded-lg p-2 w-full' />
  const Input = (props) => <input {...props} className='border border-blue-200 rounded-lg p-2 w-full' />
  
  return (
    <div className='space-y-4'>
      {slug==='document-printing' && (
        <Section>
          <h2 className='font-semibold text-lg'>Document Printing</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <div><Label>Type</Label><Select value={doc.color} onChange={e=>setDoc({...doc, color: e.target.value})}><option value='bw'>Black & White</option><option value='colour'>Colour</option></Select></div>
            <div><Label>Size</Label><Select value={doc.size} onChange={e=>setDoc({...doc, size: e.target.value})}><option>A4</option><option>A3</option></Select></div>
            <div><Label>Paper</Label><Select value={doc.gsm} onChange={e=>setDoc({...doc, gsm: Number(e.target.value)})}><option value={80}>80 GSM</option><option value={100}>100 GSM</option><option value={130}>130 GSM</option></Select></div>
            <div><Label>Sides</Label><Select value={doc.sides} onChange={e=>setDoc({...doc, sides: e.target.value})}><option value='single'>Single-sided</option><option value='double'>Double-sided</option></Select></div>
            <div><Label>Pages</Label><Input type='number' min='1' value={doc.pages} onChange={e=>setDoc({...doc, pages: Number(e.target.value)})}/></div>
          </div>
        </Section>
      )}

      {slug==='business-stationery' && (
        <Section>
          <h2 className='font-semibold text-lg'>Visiting Cards</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <div><Label>Type</Label><Select value={visit.card_type} onChange={e=>setVisit({...visit, card_type: e.target.value})}><option value='personal'>Personal</option><option value='office'>Office</option></Select></div>
            <div><Label>Paper</Label><Select value={visit.paper} onChange={e=>setVisit({...visit, paper: e.target.value})}><option value='economy_250_matte'>Economy 250 GSM matte</option><option value='premium_300_matte'>Premium 300 GSM matte</option><option value='premium_300_gloss'>Premium 300 GSM gloss</option></Select></div>
            <div><Label>Quantity</Label><Select value={visit.quantity} onChange={e=>setVisit({...visit, quantity: Number(e.target.value)})}><option value={50}>50</option><option value={100}>100</option></Select></div>
            <div><Label>Design</Label><Select value={visit.design} onChange={e=>setVisit({...visit, design: e.target.value})}><option value='ready_design'>Upload ready design</option><option value='logo_plus_text'>Upload logo + text</option></Select></div>
          </div>
        </Section>
      )}

      {slug==='marketing-prints' && (
        <Section>
          <h2 className='font-semibold text-lg'>Marketing Prints - Flyers</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <div><Label>Size</Label><Select value={flyer.size} onChange={e=>setFlyer({...flyer, size: e.target.value})}><option value='A5'>A5</option><option value='A4'>A4</option></Select></div>
            <div><Label>GSM</Label><Select value={flyer.gsm} onChange={e=>setFlyer({...flyer, gsm: Number(e.target.value)})}><option value={130}>130</option></Select></div>
            <div><Label>Quantity</Label><Select value={flyer.quantity} onChange={e=>setFlyer({...flyer, quantity: Number(e.target.value)})}><option value={50}>50</option><option value={100}>100</option></Select></div>
          </div>
        </Section>
      )}

      {slug==='custom-mugs' && (
        <Section>
          <h2 className='font-semibold text-lg'>Personalized Ceramic Mug</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <div><Label>Print area</Label><Select value={mug.print_area} onChange={e=>setMug({...mug, print_area: e.target.value})}><option value='one_side'>Print on one side</option><option value='wrap'>Wrap-around</option></Select></div>
            <div><Label>Quantity</Label><Select value={mug.quantity} onChange={e=>setMug({...mug, quantity: Number(e.target.value)})}><option value={1}>1</option><option value={2}>2</option><option value={4}>4</option></Select></div>
            <div className='md:col-span-2'><Label>Text (optional)</Label><Input value={mug.text} onChange={e=>setMug({...mug, text: e.target.value})} placeholder='Message on mug'/></div>
          </div>
        </Section>
      )}

      {/* File upload for relevant categories */}
      {(slug==='document-printing' || slug==='business-stationery' || slug==='marketing-prints' || slug==='custom-mugs') && (
        <Section>
          <h3 className='font-semibold'>Upload Files</h3>
          <input type='file' multiple onChange={handleUpload} />
          {busy && <div className='text-sm text-blue-700/70'>Uploading...</div>}
          <ul className='text-sm text-blue-700/80 list-disc pl-5'>
            {files.map((f,i)=> <li key={i}>{f.filename}</li>)}
          </ul>
        </Section>
      )}

      {/* Add-ons for bindings */}
      {slug==='document-printing' && (
        <Section>
          <h3 className='font-semibold'>Bindings & Finishing (Add-ons)</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <div>
              <Label>Spiral Binding</Label>
              <Select value={addons.spiral_binding||''} onChange={e=> setAddons({...addons, spiral_binding: e.target.value||null})}>
                <option value=''>None</option>
                <option value='up_to_80'>Up to 80 pages (+₹30)</option>
                <option value='81_150'>81–150 pages (+₹40)</option>
              </Select>
            </div>
            <div>
              <Label>Lamination</Label>
              <Select value={addons.lamination||''} onChange={e=> setAddons({...addons, lamination: e.target.value||null})}>
                <option value=''>None</option>
                <option value='ID'>ID size (+₹15)</option>
                <option value='A4'>A4 (+₹40)</option>
                <option value='A3'>A3 (+₹60)</option>
              </Select>
            </div>
          </div>
        </Section>
      )}

      <div className='sticky bottom-20 md:bottom-6'>
        <button onClick={addItem} className='w-full md:w-auto px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:shadow-md transition'>Add to Cart</button>
      </div>
    </div>
  )
}
