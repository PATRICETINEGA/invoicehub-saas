# InvoiceHub SaaS

Full-stack invoice and client management application.

## Features

- User authentication
- Client management (create, list, details)
- Invoices with line items, quantities, and unit prices
- Invoice status workflow (draft → sent → paid / overdue)
- Dashboard with totals and outstanding amounts
- Role-based access (user / admin)
- Seed data for immediate demo

## Tech Stack

- Next.js 14 (App Router)
- Prisma + SQLite
- NextAuth.js
- Tailwind CSS
- TypeScript

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

### Demo accounts

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@invoicehub.app | admin123  |
| User  | demo@invoicehub.app  | demo123   |

## License

MIT License
