import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, Printer, Share2 } from 'lucide-react'
import { Page, LogoMark } from '../components'
import { useStore } from '../store'
import { naira, fmtDateTime } from '../data'

export function ServiceBilling() {
  const { patients, services, createBill, toast } = useStore()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const [pid, setPid] = useState(sp.get('patient') || '')
  const [picked, setPicked] = useState([])
  const items = services.filter((s) => picked.includes(s.id))
  const total = items.reduce((s, i) => s + i.price, 0)
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const generate = () => {
    if (!pid) return toast('Select a patient')
    if (items.length === 0) return toast('Select at least one service')
    const bill = createBill(pid, items.map((i) => ({ name: i.name, qty: 1, price: i.price })))
    navigate(`/billing/receipt/${bill.id}`, { replace: true })
  }

  return (
    <Page title="Service Billing">
      <div className="form">
        <label>Patient</label>
        <select className="input" value={pid} onChange={(e) => setPid(e.target.value)}>
          <option value="">Select patient</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.name} (P ID: {p.id})</option>)}
        </select>
        <label>Select Services</label>
      </div>
      <div className="list">
        {services.map((s) => (
          <div className="row check" key={s.id} onClick={() => toggle(s.id)}>
            <span className={`box ${picked.includes(s.id) ? 'on' : ''}`}>{picked.includes(s.id) && <Check size={13} />}</span>
            <div className="row-main"><div className="row-title">{s.name}</div></div>
            <span>{naira(s.price)}</span>
          </div>
        ))}
      </div>
      <div className="kv total big"><span>Total Amount</span><b>{naira(total)}</b></div>
      <button type="button" className="btn btn-primary" onClick={generate}>Generate Bill</button>
    </Page>
  )
}

export function Receipt() {
  const { id } = useParams()
  const { bills, patients } = useStore()
  const bill = bills.find((b) => b.id === id)
  const p = bill && patients.find((x) => x.id === bill.patientId)
  if (!bill || !p) return <Page title="Billing Receipt"><div className="empty">Receipt not found</div></Page>

  const share = () => {
    const lines = bill.items.map((i) => `${i.name} x${i.qty} - ${naira(i.price * i.qty)}`).join('\n')
    const text = `M.G TRUST MEDICAL\nReceipt ${bill.id}\nPatient: ${p.name} (${p.id})\n${lines}\nTotal: ${naira(bill.total)}\nThank you for choosing M.G TRUST MEDICAL. Stay Healthy!`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <Page title="Billing Receipt">
      <div className="card receipt">
        <div className="receipt-head">
          <LogoMark size={34} />
          <div><b>M.G TRUST MEDICAL</b><div className="row-sub">Health • Care • Trust</div></div>
        </div>
        <div className="receipt-title">Receipt</div>
        <div className="kv"><span>Patient:</span><b>{p.name}</b></div>
        <div className="kv"><span>P ID:</span><b>{p.id}</b></div>
        <div className="kv"><span>Receipt No:</span><b>{bill.id}</b></div>
        <div className="kv"><span>Date:</span><b>{fmtDateTime(bill.at)}</b></div>
        <table>
          <thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>
            {bill.items.map((i, k) => (
              <tr key={k}><td>{i.name}</td><td>{i.qty}</td><td>{naira(i.price)}</td><td>{naira(i.price * i.qty)}</td></tr>
            ))}
            <tr className="sum"><td colSpan="3">Total</td><td>{naira(bill.total)}</td></tr>
          </tbody>
        </table>
        <p className="thanks">Thank you for choosing<br /><b>M.G TRUST MEDICAL</b><br />Stay Healthy!</p>
      </div>
      <div className="btn-row no-print">
        <button type="button" className="btn btn-primary" onClick={() => window.print()}><Printer size={15} /> Print</button>
        <button type="button" className="btn btn-outline" onClick={share}><Share2 size={15} /> Share</button>
      </div>
    </Page>
  )
}
