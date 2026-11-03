'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewInvoicePage() {
  const [clients, setClients] = useState<any[]>([])
  const [clientId, setClientId] = useState('')
  const [number, setNumber] = useState('')
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/clients').then((r) => r.json()).then(setClients).catch(() => {})
  }, [])

  function addItem() {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])
  }

  function updateItem(i: number, field: string, value: any) {
    const next = [...items]
    next[i] = { ...next[i], [field]: value }
    setItems(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, number, items }),
    })
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/dashboard" className="text-blue-600">← Dashboard</Link>
      </nav>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">New Invoice</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full border rounded px-3 py-2" required>
            <option value="">Select client</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="text" placeholder="Invoice number (e.g. INV-1002)" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full border rounded px-3 py-2" required />
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} className="border rounded px-3 py-2 col-span-1" required />
              <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} className="border rounded px-3 py-2" />
              <input type="number" placeholder="Price" value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', e.target.value)} className="border rounded px-3 py-2" />
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-sm text-blue-600">+ Add line item</button>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </form>
      </main>
    </div>
  )
}
