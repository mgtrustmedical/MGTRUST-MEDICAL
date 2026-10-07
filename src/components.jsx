import { NavLink, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Users, Stethoscope, ShoppingCart, MoreHorizontal, X } from 'lucide-react'
import { useStore } from './store'

export function LogoMark({ size = 40, cross = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 58C10 42 4 30 4 20 4 12 10 6 18 6c6 0 11 3 14 8 3-5 8-8 14-8 8 0 14 6 14 14 0 10-6 22-28 38z" fill="#1570ef" />
      {cross ? (
        <path d="M32 21v22M21 32h22" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      ) : (
        <path d="M12 32h12l5-10 7 20 5-10h11" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

export function BottomNav() {
  const items = [
    { to: '/home', label: 'Home', Icon: Home },
    { to: '/patients', label: 'Patients', Icon: Users },
    { to: '/services', label: 'Services', Icon: Stethoscope },
    { to: '/sales', label: 'Sales', Icon: ShoppingCart },
    { to: '/settings', label: 'More', Icon: MoreHorizontal },
  ]
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function Page({ title, back = true, right, header, nav = true, children }) {
  const navigate = useNavigate()
  const { toastMsg } = useStore()
  return (
    <div className="phone">
      {header || (
        <header className="topbar">
          {back && (
            <button type="button" className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1>{title}</h1>
          <div className="topbar-right">{right}</div>
        </header>
      )}
      <main className="content">{children}</main>
      {nav && <BottomNav />}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  )
}

const AV_COLORS = ['#1570ef', '#7a5af8', '#12b76a', '#f79009', '#ee46bc', '#06aed4']
export function Avatar({ name = '?', size = 40 }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
  const color = AV_COLORS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AV_COLORS.length]
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: color + '22', color }}>
      {initials}
    </div>
  )
}

export function Stat({ icon: Icon, label, value, tone = 'blue', delta }) {
  return (
    <div className={`stat tone-${tone}`}>
      <div className="stat-icon"><Icon size={18} /></div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {delta !== undefined && (
          <div className={`stat-delta ${delta < 0 ? 'down' : ''}`}>{delta < 0 ? '↓' : '↑'} {Math.abs(delta)}%</div>
        )}
      </div>
    </div>
  )
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button type="button" key={o} className={o === value ? 'active' : ''} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  )
}

export function Sheet({ open, title, onClose, children }) {
  if (!open) return null
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h3>{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
