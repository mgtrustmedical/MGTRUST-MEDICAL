import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import Login from './pages/Auth'
import Home from './pages/Home'
import { RegisterPatient, PatientList, PatientDetails } from './pages/Patients'
import { ServicesPage, ServiceDetails } from './pages/Services'
import { SalesPage, NewSale } from './pages/Sales'
import { ServiceBilling, Receipt } from './pages/Billing'
import { Analytics, Breakdown } from './pages/Analytics'
import { DailyReport, TotalReport } from './pages/Reports'
import { Settings, About } from './pages/More'

export default function App() {
  const { user } = useStore()
  if (!user) return <Login />
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<RegisterPatient />} />
      <Route path="/patients" element={<PatientList />} />
      <Route path="/patients/:id" element={<PatientDetails />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetails />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/sales/new" element={<NewSale />} />
      <Route path="/billing" element={<ServiceBilling />} />
      <Route path="/billing/receipt/:id" element={<Receipt />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/analytics/breakdown" element={<Breakdown />} />
      <Route path="/reports/daily" element={<DailyReport />} />
      <Route path="/reports/total" element={<TotalReport />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
