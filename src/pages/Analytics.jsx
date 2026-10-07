import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, Repeat, Wallet } from 'lucide-react'
import { Page, Stat, Segmented } from '../components'
import { LineChart, Donut } from '../charts'
import { useStore } from '../store'
import { addDays, dayKey, fmtDate, naira, COLORS } from '../data'

const pct = (a, b) => (b ? Math.round(((a - b) / b) * 100) : 0)

export function Analytics() {
  const { statsFor, rangeStats, serviceMix, genderMix } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Overview')
  const [range, setRange] = useState(1)
  const today = new Date()
  const from = addDays(today, -(range - 1))
  const cur = rangeStats(dayKey(from), dayKey(today))
  const prev = rangeStats(dayKey(addDays(today, -(2 * range - 1))), dayKey(addDays(today, -range)))
  const rev = cur.serviceRev + cur.productRev
  const prevRev = prev.serviceRev + prev.productRev
  const trendDays = [...Array(7)].map((_, i) => addDays(today, i - 6))
  const trend = trendDays.map((d) => statsFor(dayKey(d)).patients)
  const labels = trendDays.map((d) => d.toLocaleDateString('en-US', { weekday: 'short' }))

  return (
    <Page title="Analytics" back={false}>
      <Segmented options={['Overview', 'Patients', 'Revenue']} value={tab} onChange={setTab} />
      <div className="date-row">
        <span>{fmtDate(from)} – {fmtDate(today)}</span>
        <select value={range} onChange={(e) => setRange(Number(e.target.value))}>
          <option value={1}>Today</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {tab !== 'Revenue' && (
        <div className="stat-grid">
          <Stat icon={Users} label="Total Patients" value={cur.patients} tone="blue" delta={pct(cur.patients, prev.patients)} />
          <Stat icon={UserPlus} label="New Patients" value={cur.newPatients} tone="green" delta={pct(cur.newPatients, prev.newPatients)} />
          <Stat icon={Repeat} label="Returning" value={cur.returning} tone="purple" delta={pct(cur.returning, prev.returning)} />
          {tab === 'Overview' && <Stat icon={Wallet} label="Total Revenue" value={naira(rev)} tone="orange" delta={pct(rev, prevRev)} />}
        </div>
      )}

      {tab === 'Revenue' && (
        <>
          <div className="stat-grid">
            <Stat icon={Wallet} label="Total Revenue" value={naira(rev)} tone="orange" delta={pct(rev, prevRev)} />
            <Stat icon={Wallet} label="Service Revenue" value={naira(cur.serviceRev)} tone="blue" />
            <Stat icon={Wallet} label="Product Revenue" value={naira(cur.productRev)} tone="green" />
          </div>
          <div className="card">
            <div className="card-title">Top Services</div>
            {serviceMix.map((s, i) => (
              <div className="bar-row" key={s.name}>
                <span>{s.name}</span>
                <div><i style={{ width: `${s.pct * 2.5}%`, background: COLORS[i % COLORS.length] }} /></div>
                <b>{s.pct}%</b>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'Patients' && (
        <div className="card">
          <div className="card-title">Patient Demographics</div>
          <div className="donut-wrap">
            <Donut slices={[{ value: genderMix.Male, color: '#1570ef' }, { value: genderMix.Female, color: '#ee46bc' }]} />
            <ul className="legend">
              <li><i style={{ background: '#1570ef' }} />Male <b>{genderMix.Male}%</b></li>
              <li><i style={{ background: '#ee46bc' }} />Female <b>{genderMix.Female}%</b></li>
            </ul>
          </div>
        </div>
      )}

      {tab !== 'Revenue' && (
        <div className="card">
          <div className="card-title">Patients Trend</div>
          <LineChart values={trend} labels={labels} />
        </div>
      )}
      <button type="button" className="btn btn-outline" onClick={() => navigate('/analytics/breakdown')}>Services & Demographics</button>
    </Page>
  )
}

export function Breakdown() {
  const { serviceMix, genderMix } = useStore()
  const slices = serviceMix.map((s, i) => ({ value: s.value, color: COLORS[i % COLORS.length] }))
  return (
    <Page title="Top Services">
      <div className="card">
        <div className="donut-wrap">
          <Donut slices={slices} />
          <ul className="legend">
            {serviceMix.map((s, i) => (
              <li key={s.name}><i style={{ background: COLORS[i % COLORS.length] }} />{s.name} <b>{s.pct}%</b></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Patient Demographics</div>
        <div className="donut-wrap">
          <Donut slices={[{ value: genderMix.Male, color: '#1570ef' }, { value: genderMix.Female, color: '#ee46bc' }]} />
          <ul className="legend">
            <li><i style={{ background: '#1570ef' }} />Male <b>{genderMix.Male}%</b></li>
            <li><i style={{ background: '#ee46bc' }} />Female <b>{genderMix.Female}%</b></li>
          </ul>
        </div>
      </div>
    </Page>
  )
}
