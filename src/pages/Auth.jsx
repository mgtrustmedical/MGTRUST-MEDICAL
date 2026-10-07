import { useState } from 'react'
import { useStore } from '../store'
import { LogoMark } from '../components'

export default function Login() {
  const { setUser, toast, toastMsg } = useStore()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  // Placeholder auth: replace with Supabase Auth.
  const submit = (e) => {
    e.preventDefault()
    if (!email.trim() || !pw.trim()) return toast('Enter your email and password')
    setUser({ name: name.trim() || 'Admin', email: email.trim() })
  }

  return (
    <div className="phone login">
      <div className="login-brand">
        <LogoMark size={96} cross />
        <h1>M.G TRUST<br /><span>MEDICAL</span></h1>
        <p>Health &nbsp;•&nbsp; Care &nbsp;•&nbsp; Trust</p>
      </div>
      <form className="login-form" onSubmit={submit}>
        {mode === 'signup' && (
          <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="btn btn-primary" type="submit">{mode === 'login' ? 'Login' : 'Create Account'}</button>
        <button className="btn btn-outline" type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Create Account' : 'Back to Login'}
        </button>
        <button className="link-btn" type="button" onClick={() => toast('Password reset will work once Supabase Auth is connected')}>
          Forgot Password?
        </button>
      </form>
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  )
}
