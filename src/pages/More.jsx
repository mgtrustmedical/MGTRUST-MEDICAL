import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, KeyRound, Bell, Clock, Printer, Download, HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react'
import { Page, Sheet, LogoMark } from '../components'
import { useStore } from '../store'

export function Settings() {
  const { user, setUser, settings, setSettings, toast } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [hours, setHours] = useState(String(settings.retentionHours))
  const soon = (m) => () => toast(m)

  const rows = [
    { Icon: User, label: 'Profile', on: soon(`Signed in as ${user.name}`) },
    { Icon: KeyRound, label: 'Change Password', on: soon('Available once Supabase Auth is connected') },
    { Icon: Bell, label: 'Notification Settings', on: soon('Coming soon') },
    { Icon: Clock, label: 'Data Retention Policy', sub: `Current: ${settings.retentionHours} hours`, on: () => { setHours(String(settings.retentionHours)); setOpen(true) } },
    { Icon: Printer, label: 'Printer Settings', on: soon('Receipts print through your browser/printer dialog') },
    { Icon: Download, label: 'Backup & Export', on: soon('Coming soon') },
    { Icon: HelpCircle, label: 'Help & Support', on: soon('Coming soon') },
    { Icon: Info, label: 'About', on: () => navigate('/about') },
  ]

  const saveHours = () => {
    const h = Number(hours)
    if (!(h > 0)) return toast('Enter a number of hours above 0')
    setSettings({ ...settings, retentionHours: h })
    setOpen(false)
    toast('Retention policy updated')
  }

  return (
    <Page title="Settings" back={false}>
      <div className="list menu">
        {rows.map(({ Icon, label, sub, on }) => (
          <div className="row" key={label} onClick={on}>
            <Icon size={18} className="blue" />
            <div className="row-main">
              <div className="row-title">{label}</div>
              {sub && <div className="row-sub">{sub}</div>}
            </div>
            <ChevronRight size={16} className="muted" />
          </div>
        ))}
        <div className="row" onClick={() => setUser(null)}>
          <LogOut size={18} className="red" />
          <div className="row-main"><div className="row-title red">Log out</div></div>
        </div>
      </div>

      <Sheet open={open} title="Data Retention Policy" onClose={() => setOpen(false)}>
        <div className="form">
          <label>Keep patient data for (hours)</label>
          <input className="input" type="number" min="1" value={hours} onChange={(e) => setHours(e.target.value)} />
          <p className="muted">This value is a policy setting pending the centre's approval. Automatic deletion is applied by the backend once connected.</p>
          <button type="button" className="btn btn-primary" onClick={saveHours}>Save</button>
        </div>
      </Sheet>
    </Page>
  )
}

export function About() {
  const { toast } = useStore()
  return (
    <Page title="About M.G TRUST MEDICAL">
      <div className="about">
        <LogoMark size={84} cross />
        <h2>M.G TRUST MEDICAL</h2>
        <p className="muted">Health • Care • Trust</p>
        <p>M.G TRUST MEDICAL is a modern healthcare centre committed to providing quality medical services, accurate diagnosis and trusted care for our community.</p>
        <p className="muted">Version 1.0.0</p>
      </div>
      <a className="btn btn-primary" href="mailto:info@mgtrustmedical.com">Contact Us</a>
      <button type="button" className="btn btn-outline" onClick={() => toast('Privacy policy coming soon')}>Privacy Policy</button>
    </Page>
  )
}
