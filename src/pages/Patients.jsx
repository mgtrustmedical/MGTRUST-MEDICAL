import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Search, Phone, MapPin, Pencil, Plus } from 'lucide-react'
import { Page, Avatar, Segmented, Sheet } from '../components'
import { useStore } from '../store'
import { dayKey, fmtDate, fmtTime, fmtDateTime, naira } from '../data'

const REASONS = ['General Checkup', 'Consultation', 'Laboratory Test', 'Scanning', 'Follow-up', 'Other']

export function RegisterPatient() {
  const { patients, addPatient, registerVisit, toast } = useStore()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const [mode, setMode] = useState(sp.get('returning') ? 'Returning Patient' : 'New Patient')
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', phone: '', address: '', reason: '' })
  const [existing, setExisting] = useState(sp.get('returning') || '')
  const [reason2, setReason2] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submitNew = (e) => {
    e.preventDefault()
    const missing = ['name', 'age', 'phone', 'address', 'reason'].find((k) => !String(form[k]).trim())
    if (missing) return toast('Please fill in all required fields')
    const p = addPatient({ ...form, name: form.name.trim(), age: Number(form.age) })
    toast(`Registered ${p.name} (${p.id})`)
    navigate(`/patients/${p.id}`, { replace: true })
  }

  const submitReturning = (e) => {
    e.preventDefault()
    if (!existing || !reason2) return toast('Select a patient and a reason for visit')
    registerVisit(existing, reason2)
    toast('Visit registered')
    navigate(`/patients/${existing}`, { replace: true })
  }

  return (
    <Page title="Patient Registration">
      <Segmented options={['New Patient', 'Returning Patient']} value={mode} onChange={setMode} />
      {mode === 'New Patient' ? (
        <form className="form" onSubmit={submitNew}>
          <label>Full Name <b>*</b></label>
          <input className="input" placeholder="Enter patient's full name" value={form.name} onChange={set('name')} />
          <label>Age <b>*</b></label>
          <input className="input" type="number" min="0" max="130" placeholder="Enter age" value={form.age} onChange={set('age')} />
          <label>Gender <b>*</b></label>
          <div className="gender">
            {['Male', 'Female'].map((g) => (
              <button type="button" key={g} className={form.gender === g ? 'active' : ''} onClick={() => setForm({ ...form, gender: g })}>
                {form.gender === g && <i />} {g}
              </button>
            ))}
          </div>
          <label>Phone Number <b>*</b></label>
          <input className="input" type="tel" placeholder="Enter phone number" value={form.phone} onChange={set('phone')} />
          <label>Address <b>*</b></label>
          <input className="input" placeholder="Enter address" value={form.address} onChange={set('address')} />
          <label>Reason for Visit <b>*</b></label>
          <select className="input" value={form.reason} onChange={set('reason')}>
            <option value="">Select reason</option>
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <button className="btn btn-primary" type="submit">Register Patient</button>
        </form>
      ) : (
        <form className="form" onSubmit={submitReturning}>
          <label>Patient <b>*</b></label>
          <select className="input" value={existing} onChange={(e) => setExisting(e.target.value)}>
            <option value="">Select patient</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
          </select>
          <label>Reason for Visit <b>*</b></label>
          <select className="input" value={reason2} onChange={(e) => setReason2(e.target.value)}>
            <option value="">Select reason</option>
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <button className="btn btn-primary" type="submit">Register Visit</button>
        </form>
      )}
    </Page>
  )
}

export function PatientList() {
  const { patients } = useStore()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const today = dayKey(new Date())

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase()
    return [...patients]
      .filter((p) => {
        if (filter === 'Today' && dayKey(p.visitAt) !== today) return false
        if (filter === 'New' && p.returning) return false
        if (filter === 'Returning' && !p.returning) return false
        return !t || p.name.toLowerCase().includes(t) || p.id.toLowerCase().includes(t) || p.phone.includes(t)
      })
      .sort((a, b) => new Date(b.visitAt) - new Date(a.visitAt))
  }, [patients, q, filter, today])

  return (
    <Page title="Patients" right={<button type="button" className="icon-btn" onClick={() => navigate('/register')} aria-label="Register patient"><Plus size={20} /></button>}>
      <div className="search">
        <Search size={16} />
        <input placeholder="Search by name, ID or phone..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="chips">
        {['All', 'Today', 'New', 'Returning'].map((f) => (
          <button type="button" key={f} className={f === filter ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="list">
        {rows.map((p) => (
          <div className="row" key={p.id} onClick={() => navigate(`/patients/${p.id}`)}>
            <Avatar name={p.name} />
            <div className="row-main">
              <div className="row-title">{p.name}</div>
              <div className="row-sub">P ID: {p.id} &nbsp;•&nbsp; {p.gender}</div>
              <div className="row-sub">{fmtDate(p.visitAt)} {fmtTime(p.visitAt)}</div>
            </div>
            <button type="button" className="btn-view">View</button>
          </div>
        ))}
        {rows.length === 0 && <div className="empty">No patients found</div>}
      </div>
    </Page>
  )
}

export function PatientDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { patients, bills, updatePatient, toast } = useStore()
  const p = patients.find((x) => x.id === id)
  const [edit, setEdit] = useState(false)
  const [f, setF] = useState({})

  if (!p) return <Page title="Patient Details"><div className="empty">Patient not found</div></Page>

  const lastBill = bills.find((b) => b.patientId === p.id)
  const openEdit = () => { setF({ name: p.name, age: p.age, phone: p.phone, address: p.address }); setEdit(true) }
  const save = () => {
    if (!f.name.trim() || !f.phone.trim() || !f.address.trim() || !f.age) return toast('Please fill in all fields')
    updatePatient(p.id, { ...f, name: f.name.trim(), age: Number(f.age) })
    setEdit(false)
    toast('Patient updated')
  }

  return (
    <Page title="Patient Details" right={<button type="button" className="icon-btn blue" onClick={openEdit} aria-label="Edit"><Pencil size={18} /></button>}>
      <div className="card profile">
        <Avatar name={p.name} size={54} />
        <div>
          <div className="profile-name">{p.name}</div>
          <div className="row-sub">P ID: {p.id} &nbsp;•&nbsp; {p.gender} &nbsp;•&nbsp; {p.age} years</div>
        </div>
      </div>
      <div className="card contact">
        <div><Phone size={16} /> {p.phone}</div>
        <div><MapPin size={16} /> {p.address}</div>
      </div>
      <div className="card">
        <div className="card-title">Visit Information</div>
        <div className="kv"><span>Date & Time:</span><b>{fmtDateTime(p.visitAt)}</b></div>
        <div className="kv"><span>Reason for Visit:</span><b>{p.reason}</b></div>
        <div className="kv"><span>Department:</span><b>{p.department}</b></div>
      </div>
      <div className="card">
        <div className="card-title">Services</div>
        {lastBill ? (
          <>
            {lastBill.items.map((i, k) => (
              <div className="kv" key={k}><span>{i.name}{i.qty > 1 ? ` x${i.qty}` : ''}</span><b>{naira(i.price * i.qty)}</b></div>
            ))}
            <div className="kv total"><span>Total</span><b>{naira(lastBill.total)}</b></div>
          </>
        ) : (
          <div className="row-sub">No services billed yet</div>
        )}
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-outline" onClick={openEdit}><Pencil size={15} /> Edit</button>
        <button type="button" className="btn btn-primary" onClick={() => navigate(`/register?returning=${p.id}`)}>New Visit</button>
      </div>
      <button type="button" className="btn btn-outline" onClick={() => navigate(`/billing?patient=${p.id}`)}>Bill Services</button>

      <Sheet open={edit} title="Edit Patient" onClose={() => setEdit(false)}>
        <div className="form">
          <label>Full Name</label>
          <input className="input" value={f.name || ''} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <label>Age</label>
          <input className="input" type="number" value={f.age || ''} onChange={(e) => setF({ ...f, age: e.target.value })} />
          <label>Phone Number</label>
          <input className="input" value={f.phone || ''} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <label>Address</label>
          <input className="input" value={f.address || ''} onChange={(e) => setF({ ...f, address: e.target.value })} />
          <button type="button" className="btn btn-primary" onClick={save}>Save Changes</button>
        </div>
      </Sheet>
    </Page>
  )
}
