import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getSession()
  if (!session || (session.user as any).role !== 'admin') redirect('/dashboard')

  const users = await prisma.user.findMany({ include: { _count: { select: { invoices: true, clients: true } } } })
  const invoices = await prisma.invoice.findMany({ include: { client: true, items: true } })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/dashboard" className="text-blue-600">← Dashboard</Link>
      </nav>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b font-semibold">Users</div>
            {users.map((u) => (
              <div key={u.id} className="px-6 py-3 text-sm border-b">
                {u.email} · {u._count.invoices} invoices · {u._count.clients} clients
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b font-semibold">All Invoices ({invoices.length})</div>
            {invoices.map((inv) => {
              const total = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
              return (
                <div key={inv.id} className="px-6 py-3 text-sm border-b">
                  {inv.number} · {inv.client.name} · ${total.toLocaleString()} · {inv.status}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
