import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Stethoscope, FlaskConical, Plus } from 'lucide-react'
import { Page, Segmented, Sheet } from '../components'
import { useStore } from '../store'
import { naira, SAMPLE_TYPES, COLORS } from '../data'

export function ServicesPage() {
  const { services, saveService, toast } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Services')
  const [q, setQ] = useState('')
  const [add, setAdd] = useState(false)
  const [f, setF] = useState({ name: '', price: '', kind: 'service' })

  const list = services.filter(
    (s) => (tab === 'Services' || s.kind === 'lab') && s.name.toLowerCase().includes(q.trim().toLowerCase())
  )

  const submit = () => {
    if (!f.name.trim() || !(Number(f.price) > 0)) return toast('Enter a name and a price above 0')
    saveService({ name: f.name.trim(), price: Number(f.price), kind: f.kind, sample: f.kind === 'lab' ? 'Other' : '' })
    setAdd(false)
    setF({ name: '', price: '', kind: tab === 'Services' ? 'service' : 'lab' })
    toast('Added')
  }

  return (
    <Page title="Services & Laboratory">
      <Segmented options={['Services', 'Laboratory Tests']} value={tab} onChange={setTab} />
      <div className="search">
        <Search size={16} />
        <input placeholder="Search services or tests..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="list">
        {list.map((s, i) => {
          const Icon = s.kind === 'lab' ? FlaskConical : Stethoscope
          const c = COLORS[i % COLORS.length]
          return (
            <div className="row" key={s.id} onClick={() => navigate(`/services/${s.id}`)}>
              <div className="ico" style={{ background: c + '1f', color: c }}><Icon size={18} /></div>
              <div className="row-main"><div className="row-title">{s.name}</div></div>
              <b>{naira(s.price)}</b>
            </div>
          )
        })}
        {list.length === 0 && <div className="empty">Nothing found</div>}
      </div>
      <button type="button" className="btn btn-primary" onClick={() => { setF({ name: '', price: '', kind: tab === 'Services' ? 'service' : 'lab' }); setAdd(true) }}>
        <Plus size={16} /> Add Service / Test
      </button>

      <Sheet open={add} title="Add Service / Test" onClose={() => setAdd(false)}>
        <div className="form">
          <label>Name</label>
          <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <label>Type</label>
          <select className="input" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>
            <option value="service">Service</option>
            <option value="lab">Laboratory Test</option>
          </select>
          <label>Price (₦)</label>
          <input className="input" type="number" min="0" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} />
          <button type="button" className="btn btn-primary" onClick={submit}>Save</button>
        </div>
      </Sheet>
    </Page>
  )
}

export function ServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { services, saveService, toast } = useStore()
  const s = services.find((x) => x.id === id)
  const [price, setPrice] = useState(s ? String(s.price) : '')
  const [sample, setSample] = useState(s ? s.sample : '')

  if (!s) return <Page title="Details"><div className="empty">Not found</div></Page>
  const lab = s.kind === 'lab'

  const save = () => {
    if (!(Number(price) > 0)) return toast('Enter a price above 0')
    saveService({ id: s.id, price: Number(price), sample })
    toast('Price saved')
    navigate(-1)
  }

  return (
    <Page title={lab ? 'Laboratory Test Details' : 'Service Details'}>
      <div className="card test-head">
        <div className="ico" style={{ background: '#1570ef1f', color: '#1570ef' }}>{lab ? <FlaskConical size={18} /> : <Stethoscope size={18} />}</div>
        <div>
          <div className="profile-name">{s.name}</div>
          <div className="price-big">{naira(s.price)}</div>
        </div>
      </div>
      <p className="muted">{s.description}</p>
      <div className="form">
        {lab && (
          <>
            <label>Sample Type</label>
            <select className="input" value={sample} onChange={(e) => setSample(e.target.value)}>
              {SAMPLE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </>
        )}
        <label>Price (₦)</label>
        <input className="input" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button type="button" className="btn btn-primary" onClick={save}>Save</button>
      </div>
    </Page>
  )
}
