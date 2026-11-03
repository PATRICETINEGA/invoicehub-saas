import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const isAdmin = (session.user as any).role === 'admin'

  const invoices = await prisma.invoice.findMany({
    where: isAdmin ? {} : { ownerId: userId },
    include: { client: true, items: true },
    orderBy: { createdAt: 'desc' },
  })

  const total = invoices.reduce((sum, inv) => {
    const amount = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
    return sum + amount
  }, 0)

  const outstanding = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => {
      const amount = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
      return sum + amount
    }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">InvoiceHub</h1>
        <div className="flex items-center gap-4">
          {isAdmin && <Link href="/admin" className="text-sm text-purple-600">Admin</Link>}
          <span className="text-sm text-gray-600">{session.user?.email}</span>
          <Link href="/api/auth/signout" className="text-sm text-red-600">Sign out</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Invoices</p>
            <p className="text-3xl font-bold">{invoices.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Invoiced</p>
            <p className="text-3xl font-bold">${total.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Outstanding</p>
            <p className="text-3xl font-bold">${outstanding.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Link href="/clients" className="bg-white px-4 py-2 rounded shadow text-sm">Clients</Link>
          <Link href="/invoices/new" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">New Invoice</Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b font-semibold">Recent Invoices</div>
          <div className="divide-y">
            {invoices.map((inv) => {
              const amount = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
              return (
                <Link key={inv.id} href={`/invoices/${inv.id}`} className="block px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{inv.number} · {inv.client.name}</p>
                      <p className="text-sm text-gray-500">{inv.status}</p>
                    </div>
                    <span className="font-medium">${amount.toLocaleString()}</span>
                  </div>
                </Link>
              )
            })}
            {invoices.length === 0 && <p className="px-6 py-8 text-center text-gray-500">No invoices yet</p>}
          </div>
        </div>
      </main>
    </div>
  )
}
