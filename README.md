# Restaurant Reservation Management System 🧾🍽️

A small full-stack app to manage restaurant tables and reservations with role-based access (admin and customer).

---

## 🚀 Features

- Admin: create/manage tables and view/cancel all reservations
- Customer: browse tables, create/cancel own reservations
- JWT-based authentication (Bearer tokens)
- Simple, readable REST API + React frontend

---

## 🧰 Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React + Vite
- Auth: JSON Web Tokens (JWT)

---

## ⚙️ Prerequisites

- Node.js >= 18
- MongoDB running locally or remote (set via MONGO_URI)

---

## 🔧 Setup & Run (local)

1. Clone the repo and install dependencies:

   ```bash
   git clone <repo-url>
   cd Restaurant-Reservation-Management-System
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Configure env files:

   - Backend: create `backend/.env` with:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/reservation_db
     JWT_SECRET=your_jwt_secret
     CLIENT_URL=http://localhost:5173
     ```

   - Frontend: create `frontend/.env` with:
     ```env
     VITE_API_URL=http://localhost:5000
     ```

3. Start services:

   - Backend (dev):
     ```bash
     cd backend
     npm start
     ```

   - Frontend (dev):
     ```bash
     cd frontend
     npm run dev
     ```

4. Open the app in your browser:

   - Frontend: http://localhost:5173
   - Backend: GET http://localhost:5000

---

## 🧪 Seed / Test scripts

- A small test script exists at `backend/src/seed/check_auth.js` that registers a temporary user, logs in, and tries the reservations flow. Run it with:

  ```bash
  node src/seed/check_auth.js
  ```

- Alternatively, create users and tables manually via API (see examples below).

---

## 🔌 API Endpoints (summary)

- Auth
  - POST /api/auth/register — register { name,email,password,role }
  - POST /api/auth/login — login { email,password } → returns { token, user }

- Tables (auth required)
  - GET /api/tables — list active tables (admin & customer)
  - POST /api/tables — create table (admin)
  - PATCH /api/tables/:id — update table (admin)
  - DELETE /api/tables/:id — soft-delete (admin)

- Reservations (auth required)
  - POST /api/reservations — create reservation (customer)
  - GET /api/reservations/my — list my reservations (customer)
  - DELETE /api/reservations/:id — cancel a reservation (customer — own / admin can cancel any)
  - GET /api/reservations — admin list (admin)

---


## 🐛 Troubleshooting

- 401 / 403 errors: make sure the `Authorization` header is exactly `Bearer <token>` (no quotes or extra spaces), token is not expired, and the running backend uses the same `JWT_SECRET`.
- `No token provided` in API responses: ensure the frontend stores the `token` in localStorage (login flow) and client adds it to requests (there's an axios interceptor in `frontend/src/api/client.js`).
- If frontend still shows old behavior, hard-refresh (Ctrl+Shift+R) to clear cached bundle.

---
