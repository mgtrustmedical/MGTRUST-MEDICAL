import { useState } from 'react'
import { Users, UserPlus, Repeat } from 'lucide-react'
import { Page, Stat } from '../components'
import { useStore } from '../store'
import { addDays, dayKey, fmtDate, fromKey, naira } from '../data'

function Summary({ s }) {
  return (
    <>
      <div className="stat-grid">
        <Stat icon={Users} label="Total Patients" value={s.patients} tone="blue" />
        <Stat icon={UserPlus} label="New Patients" value={s.newPatients} tone="green" />
        <Stat icon={Repeat} label="Returning Patients" value={s.returning} tone="purple" />
      </div>
      <div className="card">
        <div className="card-title">Revenue Summary</div>
        <div className="kv"><span>Service Revenue</span><b>{naira(s.serviceRev)}</b></div>
        <div className="kv"><span>Product Revenue</span><b>{naira(s.productRev)}</b></div>
        <div className="kv total"><span>Total Revenue</span><b>{naira(s.serviceRev + s.productRev)}</b></div>
      </div>
    </>
  )
}

export function DailyReport() {
  const { statsFor } = useStore()
  const todayKey = dayKey(new Date())
  const [date, setDate] = useState(todayKey)
  const s = statsFor(date || todayKey)
  return (
    <Page title="Daily Report">
      <input className="input" type="date" value={date} max={todayKey} onChange={(e) => setDate(e.target.value)} />
      <Summary s={s} />
      <button type="button" className="btn btn-primary no-print" onClick={() => window.print()}>Generate Report</button>
    </Page>
  )
}

export function TotalReport() {
  const { rangeStats, statsFor } = useStore()
  const now = new Date()
  const todayKey = dayKey(now)
  const [from, setFrom] = useState(dayKey(new Date(now.getFullYear(), now.getMonth(), 1)))
  const [to, setTo] = useState(todayKey)
  const [details, setDetails] = useState(false)
  const s = rangeStats(from, to)
  const days = []
  for (let d = fromKey(to); dayKey(d) >= from && days.length < 62; d = addDays(d, -1)) days.push(dayKey(d))

  return (
    <Page title="Total Report">
      <div className="date-inputs">
        <input className="input" type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
        <input className="input" type="date" value={to} min={from} max={todayKey} onChange={(e) => setTo(e.target.value)} />
      </div>
      <Summary s={s} />
      <button type="button" className="btn btn-primary no-print" onClick={() => setDetails(!details)}>
        {details ? 'Hide Details' : 'View Details'}
      </button>
      {details && (
        <div className="card">
          <table className="plain">
            <thead><tr><th>Date</th><th>Patients</th><th>Revenue</th></tr></thead>
            <tbody>
              {days.map((k) => {
                const d = statsFor(k)
                return <tr key={k}><td>{fmtDate(fromKey(k))}</td><td>{d.patients}</td><td>{naira(d.serviceRev + d.productRev)}</td></tr>
              })}
            </tbody>
          </table>
          {days.length >= 62 && <div className="row-sub">Showing the latest 62 days of the range</div>}
        </div>
      )}
    </Page>
  )
}
