import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { clientId, number, dueDate, notes, items, status } = body
  if (!clientId || !number || !items?.length) {
    return NextResponse.json({ error: 'clientId, number, and items required' }, { status: 400 })
  }

  const invoice = await prisma.invoice.create({
    data: {
      number,
      status: status || 'draft',
      dueDate: dueDate ? new Date(dueDate) : null,
      notes,
      clientId,
      ownerId: (session.user as any).id,
      items: {
        create: items.map((item: any) => ({
          description: item.description,
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice),
        })),
      },
    },
  })
  return NextResponse.json(invoice)
}
