import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import {
  SERVICES, PRODUCTS, SERVICE_BASE, GENDER_BASE,
  makePatients, makeBills, makeHistory, dayKey, fromKey, addDays,
} from './data'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null)
  const [patients, setPatients] = useState(makePatients)
  const [services, setServices] = useState(SERVICES)
  const [products, setProducts] = useState(PRODUCTS)
  const [bills, setBills] = useState(makeBills)
  const [sales, setSales] = useState([])
  const [settings, setSettings] = useState({ retentionHours: 48 })
  const [toastMsg, setToastMsg] = useState('')
  const timer = useRef()
  const history = useMemo(makeHistory, [])

  const toast = useCallback((m) => {
    setToastMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastMsg(''), 2200)
  }, [])

  // ---- patients
  const addPatient = (p) => {
    const id = 'MG-' + String(patients.length + 1).padStart(3, '0')
    const patient = { ...p, id, department: 'General', visitAt: new Date().toISOString(), visits: 1, returning: false }
    setPatients((prev) => [patient, ...prev])
    return patient
  }
  const registerVisit = (id, reason) =>
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, reason, visitAt: new Date().toISOString(), visits: p.visits + 1, returning: true } : p))
    )
  const updatePatient = (id, patch) => setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))

  // ---- services / lab (prices are admin-editable)
  const saveService = (item) => {
    if (item.id) {
      setServices((prev) => prev.map((s) => (s.id === item.id ? { ...s, ...item } : s)))
      return item.id
    }
    const id = (item.kind === 'lab' ? 'lab-' : 'svc-') + Date.now()
    setServices((prev) => [...prev, { description: '', sample: '', ...item, id }])
    return id
  }

  // ---- billing
  const createBill = (patientId, items) => {
    const bill = {
      id: 'B-' + String(bills.length + 1).padStart(4, '0'),
      patientId,
      items,
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      at: new Date().toISOString(),
    }
    setBills((prev) => [bill, ...prev])
    return bill
  }

  // ---- sales (stock reduces automatically)
  const createSale = (items) => {
    const sale = {
      id: 'S-' + String(sales.length + 1).padStart(4, '0'),
      items,
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      at: new Date().toISOString(),
    }
    setSales((prev) => [sale, ...prev])
    setProducts((prev) =>
      prev.map((p) => {
        const it = items.find((i) => i.productId === p.id)
        return it ? { ...p, stock: p.stock - it.qty } : p
      })
    )
    return sale
  }

  // ---- stats
  const statsFor = useCallback(
    (key) => {
      const h = history[key] || { patients: 0, newPatients: 0, returning: 0, serviceRev: 0, productRev: 0 }
      const day = patients.filter((p) => dayKey(p.visitAt) === key)
      const ret = day.filter((p) => p.returning).length
      const serviceRev = bills.filter((b) => dayKey(b.at) === key).reduce((s, b) => s + b.total, 0)
      const productRev = sales.filter((s) => dayKey(s.at) === key).reduce((s, x) => s + x.total, 0)
      return {
        patients: h.patients + day.length,
        newPatients: h.newPatients + day.length - ret,
        returning: h.returning + ret,
        serviceRev: h.serviceRev + serviceRev,
        productRev: h.productRev + productRev,
      }
    },
    [history, patients, bills, sales]
  )

  const rangeStats = useCallback(
    (from, to) => {
      const t = { patients: 0, newPatients: 0, returning: 0, serviceRev: 0, productRev: 0 }
      for (let d = fromKey(from); dayKey(d) <= to; d = addDays(d, 1)) {
        const s = statsFor(dayKey(d))
        for (const k in t) t[k] += s[k]
      }
      return t
    },
    [statsFor]
  )

  const serviceMix = useMemo(() => {
    const c = { ...SERVICE_BASE }
    bills.forEach((b) => b.items.forEach((i) => { c[i.name] = (c[i.name] || 0) + i.qty }))
    const total = Object.values(c).reduce((a, b) => a + b, 0)
    return Object.entries(c)
      .map(([name, value]) => ({ name, value, pct: Math.round((value / total) * 100) }))
      .sort((a, b) => b.value - a.value)
  }, [bills])

  const genderMix = useMemo(() => {
    const c = { ...GENDER_BASE }
    patients.forEach((p) => { c[p.gender] = (c[p.gender] || 0) + 1 })
    const male = Math.round((c.Male / (c.Male + c.Female)) * 100)
    return { Male: male, Female: 100 - male }
  }, [patients])

  const value = {
    user, setUser, patients, services, products, bills, sales, settings, setSettings,
    toastMsg, toast, addPatient, registerVisit, updatePatient, saveService,
    createBill, createSale, statsFor, rangeStats, serviceMix, genderMix,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
