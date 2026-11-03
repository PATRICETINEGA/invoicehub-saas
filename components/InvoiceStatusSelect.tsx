'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statuses = ['draft', 'sent', 'paid', 'overdue']

export default function InvoiceStatusSelect({ invoiceId, current }: { invoiceId: string; current: string }) {
  const [status, setStatus] = useState(current)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function change(newStatus: string) {
    setLoading(true)
    setStatus(newStatus)
    await fetch('/api/invoices/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: invoiceId, status: newStatus }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <select
      value={status}
      onChange={(e) => change(e.target.value)}
      disabled={loading}
      className="text-sm border rounded px-3 py-1"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}
