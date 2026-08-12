# IMR — Internet Movies Rental Portal

A full-stack movie database portal built with Next.js, NextAuth, and Tailwind CSS for CPRG 306 Web Development 2 at SAIT.

## Tech Stack
- Next.js 16.2.6
- React 19
- TypeScript
- Tailwind CSS v4
- NextAuth v5
- Supabase (database — coming soon)

## Getting Started

```bash
npm install --legacy-peer-deps
npm run dev
```

## .env.local

```env
AUTH_SECRET=XA2ov72/6eY0iAuX3fdS0mBtydeHt6sLQe7UFAKdNic=
NEXTAUTH_URL=http://localhost:3000
```

## Login Credentials

```
Admin Email:    admin@imr.com
Admin Password: Admin123!
```

Admin can add, edit, and delete movies. Register any email at /register for read-only access.

## Features
- Movie catalogue with search and genre filter
- Role-based access — admin CRUD vs read-only user
- Add, edit, delete movies with data validation
- Cinema dark theme with colour-coded genre badges
- Responsive navbar and footer

## Author
Adel Tammam — SAIT CPRG 306