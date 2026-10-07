// Demo data. Replace with Supabase queries when the backend is connected.

export const naira = (n) => '₦' + Number(n || 0).toLocaleString('en-NG')

export const pad = (n) => String(n).padStart(2, '0')
export const dayKey = (d) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`
}
export const fromKey = (k) => new Date(k + 'T00:00:00')
export const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
export const fmtTime = (d) =>
  new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
export const fmtDateTime = (d) => `${fmtDate(d)}, ${fmtTime(d)}`

export const SERVICES = [
  { id: 'svc-consultation', name: 'Consultation', price: 5000, kind: 'service', description: 'General doctor consultation', sample: '' },
  { id: 'svc-scanning', name: 'Scanning', price: 15000, kind: 'service', description: 'Ultrasound scanning', sample: '' },
  { id: 'lab-urine', name: 'Urine MCS', price: 8000, kind: 'lab', description: 'Urine Microscopy, Culture and Sensitivity', sample: 'Urine' },
  { id: 'lab-hvs', name: 'HVS', price: 7000, kind: 'lab', description: 'High Vaginal Swab, Microscopy, Culture and Sensitivity', sample: 'Swab' },
  { id: 'lab-blood', name: 'Blood Test', price: 12000, kind: 'lab', description: 'Full blood count and related tests', sample: 'Blood' },
  { id: 'lab-other', name: 'Other Tests', price: 10000, kind: 'lab', description: 'Other laboratory tests', sample: 'Other' },
]

export const SAMPLE_TYPES = ['Urine', 'Blood', 'Swab', 'Stool', 'Sputum', 'Other']

export const PRODUCTS = [
  { id: 'p-paracetamol', name: 'Paracetamol 500mg', short: 'Paracetamol', price: 500, stock: 50, reorder: 10 },
  { id: 'p-amoxicillin', name: 'Amoxicillin', short: 'Amoxicillin', price: 1300, stock: 30, reorder: 10 },
  { id: 'p-sanitizer', name: 'Hand Sanitizer', short: 'Hand Sanitizer', price: 1000, stock: 45, reorder: 10 },
  { id: 'p-gloves', name: 'Surgical Gloves', short: 'Surgical Gloves', price: 2500, stock: 20, reorder: 10 },
  { id: 'p-mask', name: 'Face Mask', short: 'Face Mask', price: 800, stock: 100, reorder: 20 },
]

const at = (daysAgo, h, m) => {
  const d = addDays(new Date(), -daysAgo)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export function makePatients() {
  return [
    { id: 'MG-001', name: 'John Doe', age: 28, gender: 'Male', phone: '08012345678', address: '12 Doctor Lane, Lagos', reason: 'General Checkup', department: 'General', visitAt: at(0, 10, 24), visits: 1, returning: false },
    { id: 'MG-002', name: 'Mary Johnson', age: 34, gender: 'Female', phone: '08023456789', address: '5 Allen Avenue, Ikeja, Lagos', reason: 'Consultation', department: 'General', visitAt: at(0, 9, 15), visits: 1, returning: false },
    { id: 'MG-003', name: 'Adeyemi Peter', age: 41, gender: 'Male', phone: '08034567890', address: '22 Herbert Macaulay Way, Yaba, Lagos', reason: 'Laboratory Test', department: 'Laboratory', visitAt: at(0, 8, 45), visits: 1, returning: false },
    { id: 'MG-004', name: 'Sarah Williams', age: 26, gender: 'Female', phone: '08045678901', address: '9 Bode Thomas Street, Surulere, Lagos', reason: 'Scanning', department: 'Radiology', visitAt: at(1, 15, 20), visits: 1, returning: false },
    { id: 'MG-005', name: 'David Brown', age: 52, gender: 'Male', phone: '08056789012', address: '3 Awolowo Road, Ikoyi, Lagos', reason: 'Follow-up', department: 'General', visitAt: at(1, 14, 10), visits: 2, returning: true },
  ]
}

export function makeBills() {
  return [
    { id: 'B-0001', patientId: 'MG-001', items: [{ name: 'Consultation', qty: 1, price: 5000 }], total: 5000, at: at(0, 10, 24) },
  ]
}

// Demo baseline numbers per day (so charts and reports look populated).
// Live registrations, bills and sales are added on top in the store.
export function makeHistory() {
  const map = {}
  const now = new Date()
  for (let i = 0; i <= 120; i++) {
    const key = dayKey(addDays(now, -i))
    if (i === 0) {
      map[key] = { patients: 39, newPatients: 25, returning: 14, serviceRev: 175000, productRev: 65000 }
      continue
    }
    const p = 22 + ((i * 13 + 7) % 19)
    const n = Math.round(p * 0.66)
    map[key] = { patients: p, newPatients: n, returning: p - n, serviceRev: p * 4300, productRev: Math.round((p * 1450) / 100) * 100 }
  }
  return map
}

export const SERVICE_BASE = { Consultation: 300, 'Urine MCS': 200, HVS: 150, Scanning: 120, 'Blood Test': 100, 'Other Tests': 130 }
export const GENDER_BASE = { Male: 520, Female: 480 }
export const COLORS = ['#1570ef', '#7a5af8', '#f79009', '#12b76a', '#ef4444', '#06aed4']
