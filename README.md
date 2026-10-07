# M.G TRUST MEDICAL

Medical Centre Management, Sales and Data Analytics System (React + Vite frontend).

**Smart Management | Better Care | Healthier Community**

## Screens

Login, Dashboard, Patient Registration (new / returning), Patient List, Patient Details, Services & Laboratory (admin-editable prices), Lab Test Details, Product Sales + Stock, New Sale (stock reduces automatically), Service Billing, Receipt (print / WhatsApp share), Analytics, Services & Demographics, Daily Report, Total Report, Settings, About.

## Run

```bash
npm install
npm run dev
```

## Status

The UI is complete and works with **in-memory demo data** (see `src/data.js` and `src/store.jsx`). Nothing is saved after a refresh and no patient data is stored in this repository.

Next step: connect Supabase (auth, PostgreSQL, RLS) using `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) and replace the store functions with database calls.

## Notes

- Currency is Naira (₦).
- Service and lab prices are edited in the app (Services tab, tap an item), not hard-coded.
- No discounts and no product expiry dates.
- Data retention (Settings) is a configurable value, pending the centre's approval.
