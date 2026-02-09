# Restaurant Reservation Management System 🧾🍽️

A small full-stack app to manage restaurant tables and reservations with role-based access (admin and customer).

---
# Here is the live link https://unrivaled-naiad-bb1126.netlify.app/
## 🚀 Features

- Admin: create/manage tables and view/cancel all reservations
- Customer: browse tables, create/cancel own reservations
- JWT-based authentication (Bearer tokens)
- REST API + React frontend

---

## 🔗 Live Demo

- Frontend (Netlify): https://unrivaled-naiad-bb1126.netlify.app
- Backend (Render): https://restaurant-reservation-management-system-y27e.onrender.com

If these links change, update the hosted sites or the repository `frontend/.env` / Render environment variables accordingly.

---

## 📦 Tech Stack

- Backend: Node.js, Express, MongoDB Atlas(Mongoose)
- Frontend: React + Vite
- Auth: JSON Web Tokens (JWT)

---

## ⚙️ Environment / Deployment Notes

- Backend required env vars (set these on Render):
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — secret for signing tokens
  - `CLIENT_URL` — frontend origin (e.g. `https://unrivaled-naiad-bb1126.netlify.app`) for CORS
  - `PORT` — Render provides this automatically; do not hardcode

- Frontend required env vars (set these on Netlify):
  - `VITE_API_URL` — URL of the deployed backend, e.g. `https://restaurant-reservation-management-system-y27e.onrender.com`

Notes:
- `frontend/src/api/client.js` uses `import.meta.env.VITE_API_URL` as the API base URL.
- `backend/src/server.js` reads `process.env.CLIENT_URL` for CORS — ensure this matches the frontend domain.

---

## 🔧 Quick Local Setup

1. Clone and install:

```bash
git clone <repo-url>
cd Restaurant-Reservation-Management-System
cd backend && npm install
cd ../frontend && npm install
```

2. Local env examples:

- `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/reservation_db
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

- `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

3. Start locally:

```bash
cd backend
npm run dev   # or npm start

cd frontend
npm run dev
```

Open the frontend at http://localhost:5173

---

## ⚙️ How I deployed

- Backend: pushed the repository and created a Render Web Service using the `backend` folder as the root. Added `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in Render's Environment settings. Render provides `PORT` automatically.
- Frontend: deployed the `frontend` folder to Netlify (or the Netlify UI connected to the repo), setting `VITE_API_URL` to the Render backend URL.

---

