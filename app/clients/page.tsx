import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ClientsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const isAdmin = (session.user as any).role === 'admin'

  const clients = await prisma.client.findMany({
    where: isAdmin ? {} : { ownerId: userId },
    include: { _count: { select: { invoices: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/dashboard" className="text-blue-600">← Dashboard</Link>
      </nav>
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Link href="/clients/new" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">New Client</Link>
        </div>
        <div className="bg-white rounded-lg shadow divide-y">
          {clients.map((c) => (
            <div key={c.id} className="px-6 py-4">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">{c.company || c.email} · {c._count.invoices} invoices</p>
            </div>
          ))}
          {clients.length === 0 && <p className="px-6 py-8 text-center text-gray-500">No clients yet</p>}
        </div>
      </main>
    </div>
  )
}
