import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import InvoiceStatusSelect from '@/components/InvoiceStatusSelect'

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { client: true, items: true, owner: { select: { email: true } } },
  })

  if (!invoice) return <div className="p-8">Invoice not found</div>

  const isOwner = invoice.ownerId === (session.user as any).id
  const isAdmin = (session.user as any).role === 'admin'
  if (!isOwner && !isAdmin) return <div className="p-8">Access denied</div>

  const total = invoice.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/dashboard" className="text-blue-600">← Dashboard</Link>
      </nav>
      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between mb-6 items-start">
            <div>
              <h1 className="text-2xl font-bold">{invoice.number}</h1>
              <p className="text-gray-600">{invoice.client.name}</p>
            </div>
            <InvoiceStatusSelect invoiceId={invoice.id} current={invoice.status} />
          </div>
          <div className="border-t pt-4">
            {invoice.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm">
                <span>{item.description} × {item.quantity}</span>
                <span>${(item.quantity * item.unitPrice).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
