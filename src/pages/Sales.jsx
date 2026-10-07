import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Pill, Minus, Plus } from 'lucide-react'
import { Page, Segmented } from '../components'
import { useStore } from '../store'
import { naira, COLORS } from '../data'

export function SalesPage() {
  const { products } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Products')
  const [q, setQ] = useState('')
  const list = products.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <Page title="Product Sales" back={false}>
      <Segmented options={['Products', 'Stock']} value={tab} onChange={setTab} />
      <div className="search">
        <Search size={16} />
        <input placeholder="Search product..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="list">
        {list.map((p, i) => {
          const c = COLORS[i % COLORS.length]
          const low = p.stock <= p.reorder
          return (
            <div className="row" key={p.id}>
              <div className="ico" style={{ background: c + '1f', color: c }}><Pill size={18} /></div>
              <div className="row-main">
                <div className="row-title">{p.short}</div>
                {tab === 'Products' ? (
                  <div className="row-sub"><b className="blue">{naira(p.price)}</b> &nbsp; Stock: {p.stock}</div>
                ) : (
                  <div className="row-sub">Reorder point: {p.reorder}</div>
                )}
              </div>
              {tab === 'Products' ? (
                <button type="button" className="btn-view" disabled={p.stock < 1} onClick={() => navigate(`/sales/new?p=${p.id}`)}>
                  {p.stock < 1 ? 'Out' : 'Sell'}
                </button>
              ) : (
                <div className="stock-end">
                  <b>{p.stock}</b>
                  {low && <span className="badge warn">{p.stock < 1 ? 'Out of stock' : 'Low stock'}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button type="button" className="btn btn-primary" onClick={() => navigate('/sales/new')}>New Sale</button>
    </Page>
  )
}

export function NewSale() {
  const { products, createSale, toast } = useStore()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const [pid, setPid] = useState(sp.get('p') || products[0].id)
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState([])
  const product = products.find((p) => p.id === pid)
  const inCart = cart.filter((c) => c.productId === pid).reduce((s, c) => s + c.qty, 0)
  const available = product.stock - inCart
  const cartTotal = cart.reduce((s, c) => s + c.qty * c.price, 0)

  const add = () => {
    if (qty < 1) return toast('Quantity must be at least 1')
    if (qty > available) return toast(`Only ${available} left in stock`)
    setCart((prev) => {
      const found = prev.find((c) => c.productId === pid)
      if (found) return prev.map((c) => (c.productId === pid ? { ...c, qty: c.qty + qty } : c))
      return [...prev, { productId: pid, name: product.name, qty, price: product.price }]
    })
    setQty(1)
  }

  const pay = () => {
    if (cart.length === 0) return toast('Add a product to the cart first')
    createSale(cart)
    toast('Sale completed')
    navigate('/sales', { replace: true })
  }

  return (
    <Page title="New Sale">
      <div className="form">
        <label>Product</label>
        <select className="input" value={pid} onChange={(e) => { setPid(e.target.value); setQty(1) }}>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <label>Quantity</label>
        <div className="stepper">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)}><Plus size={16} /></button>
        </div>
        <label>Unit Price (₦)</label>
        <input className="input" value={product.price} readOnly />
        <div className="kv total"><span>Total (₦)</span><b>{naira(product.price * qty)}</b></div>
        <button type="button" className="btn btn-primary" onClick={add}>Add to Cart</button>
      </div>
      <div className="card">
        <div className="card-title">Current Cart</div>
        {cart.length === 0 && <div className="row-sub">Cart is empty</div>}
        {cart.map((c) => (
          <div className="kv" key={c.productId}>
            <span>{c.name}<br /><small>{c.qty} x {naira(c.price)}</small></span>
            <b>{naira(c.qty * c.price)}</b>
          </div>
        ))}
        {cart.length > 0 && <div className="kv total"><span>Cart Total</span><b>{naira(cartTotal)}</b></div>}
      </div>
      <button type="button" className="btn btn-primary" onClick={pay}>Proceed to Payment</button>
    </Page>
  )
}
