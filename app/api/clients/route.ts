import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isAdmin = (session.user as any).role === 'admin'
  const clients = await prisma.client.findMany({
    where: isAdmin ? {} : { ownerId: (session.user as any).id },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(clients)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, email, company, phone, address } = body
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const client = await prisma.client.create({
    data: { name, email, company, phone, address, ownerId: (session.user as any).id },
  })
  return NextResponse.json(client)
}
