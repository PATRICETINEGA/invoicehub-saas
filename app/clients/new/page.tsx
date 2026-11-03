'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewClientPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company }),
    })
    router.push('/clients')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/clients" className="text-blue-600">← Clients</Link>
      </nav>
      <main className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">New Client</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
          <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border rounded px-3 py-2" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Client'}
          </button>
        </form>
      </main>
    </div>
  )
}
