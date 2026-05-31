# OpenShop Admin (scaffold)

This repository is a starter admin panel scaffold for OpenShop using React + TypeScript + Vite + Tailwind.

Quick start:

```bash
cd openshop-admin
npm install
npm run dev
# open http://localhost:5174/admin/login
```

Notes:
- API base URL is set to `http://localhost:4000/api` in `src/api/index.ts`.
- Auth token is stored in `localStorage` under `admin_token`.
- This scaffold includes basic layout, login, dashboard and routing; extend pages and components as needed.
