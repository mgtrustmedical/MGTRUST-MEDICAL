import { useNavigate } from 'react-router-dom'
import { Bell, Users, UserPlus, Repeat, Wallet, Receipt, BarChart3, FileText, ClipboardList } from 'lucide-react'
import { Page, Stat, Avatar, LogoMark } from '../components'
import { BarChart } from '../charts'
import { useStore } from '../store'
import { addDays, dayKey, naira } from '../data'

export default function Home() {
  const { user, statsFor, toast } = useStore()
  const navigate = useNavigate()
  const now = new Date()
  const s = statsFor(dayKey(now))
  const days = [...Array(7)].map((_, i) => addDays(now, i - 6))
  const values = days.map((d) => statsFor(dayKey(d)).patients)
  const labels = days.map((d) => d.toLocaleDateString('en-US', { weekday: 'short' }))

  const header = (
    <header className="topbar home-top">
      <LogoMark size={28} />
      <h1>M.G TRUST MEDICAL</h1>
      <div className="topbar-right">
        <button type="button" className="icon-btn" onClick={() => toast('No new notifications')} aria-label="Notifications"><Bell size={18} /></button>
        <Avatar name={user.name} size={30} />
      </div>
    </header>
  )

  const quick = [
    { to: '/register', label: 'Register', Icon: UserPlus },
    { to: '/billing', label: 'Billing', Icon: Receipt },
    { to: '/analytics', label: 'Analytics', Icon: BarChart3 },
    { to: '/reports/daily', label: 'Daily', Icon: FileText },
    { to: '/reports/total', label: 'Total', Icon: ClipboardList },
  ]

  return (
    <Page header={header}>
      <div className="welcome">
        <h2>Welcome, {user.name}</h2>
        <p>Here's what's happening today</p>
      </div>
      <div className="stat-grid">
        <Stat icon={Users} label="Total Patients" value={s.patients} tone="blue" />
        <Stat icon={UserPlus} label="New Patients" value={s.newPatients} tone="green" />
        <Stat icon={Repeat} label="Returning" value={s.returning} tone="purple" />
        <Stat icon={Wallet} label="Today's Revenue" value={naira(s.serviceRev + s.productRev)} tone="orange" />
      </div>
      <div className="card">
        <div className="card-title">Patients This Week</div>
        <BarChart values={values} labels={labels} />
      </div>
      <div className="quick">
        {quick.map(({ to, label, Icon }) => (
          <button type="button" key={to} onClick={() => navigate(to)}>
            <span><Icon size={20} /></span>
            {label}
          </button>
        ))}
      </div>
    </Page>
  )
}
