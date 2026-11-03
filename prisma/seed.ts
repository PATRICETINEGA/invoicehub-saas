import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('demo123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@invoicehub.app' },
    update: {},
    create: {
      email: 'admin@invoicehub.app',
      name: 'Admin',
      password: adminPassword,
      role: 'admin',
    },
  })

  const demo = await prisma.user.upsert({
    where: { email: 'demo@invoicehub.app' },
    update: {},
    create: {
      email: 'demo@invoicehub.app',
      name: 'Demo User',
      password: userPassword,
      role: 'user',
    },
  })

  const existingClient = await prisma.client.findFirst({
    where: { name: 'Acme Corp', ownerId: demo.id },
  })

  let client = existingClient
  if (!client) {
    client = await prisma.client.create({
      data: {
        name: 'Acme Corp',
        email: 'billing@acme.com',
        company: 'Acme Corporation',
        ownerId: demo.id,
      },
    })
  }

  const existingInvoice = await prisma.invoice.findFirst({
    where: { number: 'INV-1001', ownerId: demo.id },
  })

  if (!existingInvoice && client) {
    await prisma.invoice.create({
      data: {
        number: 'INV-1001',
        status: 'sent',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        clientId: client.id,
        ownerId: demo.id,
        items: {
          create: [
            { description: 'Website redesign', quantity: 1, unitPrice: 2500 },
            { description: 'Logo design', quantity: 1, unitPrice: 800 },
          ],
        },
      },
    })
  }

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
