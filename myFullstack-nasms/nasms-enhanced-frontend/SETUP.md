# NASMS Frontend — Setup Guide

## Stack
- React 19, TanStack Router v1, TanStack Query v5
- Tailwind CSS v4, shadcn/ui, Recharts
- TypeScript, Vite 8, DM Sans + Playfair Display

## Quick Start

```bash
cd nasms-project
npm install       # or: bun install
npm run dev       # starts on http://localhost:5173
```

Backend must be running on http://localhost:8086

## Role-Based Access

| Role    | What they see                                      |
|---------|----------------------------------------------------|
| ADMIN   | Full admin panel — approve/reject loans, manage farmers, packages, seasons |
| FARMER  | Dashboard, apply for loans, market, weather        |
| BUYER   | Browse market listings, contact sellers            |
| SELLER  | Create market listings, view buyers                |

## Key Pages

| Route        | Description                                  |
|--------------|----------------------------------------------|
| `/`          | Public landing page                          |
| `/login`     | Login — all roles, JWT stored in localStorage|
| `/register`  | 3-step farmer registration                   |
| `/dashboard` | Farmer dashboard with live profile + charts  |
| `/admin`     | Admin-only: farmers, loans, packages, seasons|
| `/loans`     | Loan packages + application history          |
| `/weather`   | Live OpenWeatherMap data for all 47 counties |
| `/market`    | Market listings (buyers & sellers)           |
| `/analytics` | Production analytics charts                  |
| `/chat`      | Support chat                                 |

## Auth Flow
- Token stored in `localStorage` as `nasms_token`
- Role stored as `nasms_role`
- Auth guard in `__root.tsx` redirects unauthenticated users to `/login`
- Admins redirect to `/admin` on login
- Farmers redirect to `/dashboard` on login
- Logout clears all `nasms_*` keys — user must re-enter password to log back in
