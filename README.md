# EventSphere (MERN) — Starter (Improved Frontend + Deployable ZIP)

This repository is a fully working starter MERN project (backend + frontend using Vite + Tailwind). It includes JWT auth, event CRUD, registration flow, QR-code generation (backend), and a polished responsive frontend.

## What you will get
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, QR generation, basic admin stats.
- Frontend: React (Vite), Tailwind CSS, clean UI, login/signup, events listing, details, registration, dashboard.

---

## Quick baby-steps to get it running locally (very detailed)

### 1) Prerequisites
- Node.js (v18+ recommended)
- npm
- Git
- A MongoDB Atlas account (or local MongoDB)

### 2) Setup MongoDB Atlas
1. Sign in to https://www.mongodb.com/cloud/atlas and create a free cluster.
2. In **Network Access** add your IP (or `0.0.0.0/0` for testing).
3. In **Database Access** create a database user with a password.
4. Get the **connection string** (click *Connect* → *Connect your application*), copy the URI and replace `<password>` with your DB user password. Example:
   ```
   mongodb+srv://<user>:<password>@cluster0.xyz.mongodb.net/eventsphere?retryWrites=true&w=majority
   ```

### 3) Backend setup (local)
1. Open terminal:
   ```
   cd eventsphere/backend
   npm install
   ```
2. Create a `.env` in `backend/` using `.env.example`. Fill values:
   - MONGO_URI = your Atlas URI
   - JWT_SECRET = a long random string
   - CLOUDINARY_* (optional, only if using image upload)
   - SMTP_* (optional, for emails)
   - FRONTEND_URL = http://localhost:5173
3. Start backend:
   ```
   npm run start:dev
   ```
   Server should run on port 5000 by default.

### 4) Frontend setup (local)
1. Open a new terminal:
   ```
   cd eventsphere/frontend
   npm install
   ```
2. Create a file `.env` at `frontend/` with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start frontend:
   ```
   npm run dev
   ```
   The app runs at `http://localhost:5173`.

### 5) Create an admin user (quick)
- Use MongoDB Atlas > Collections > insert a document in `users` collection:
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "<bcrypt-hashed-password>",
  "role": "admin"
}
```
Easiest: register via the signup page, then update the user's `role` value to `admin` in Atlas UI.

### 6) Test flows
- Sign up, login.
- Create events using an Organizer account (role = organizer).
- Browse events on landing, register for an event (must be logged in).
- Check Dashboard and Admin pages.

---

## Push to GitHub (step-by-step)
1. Create a repo on GitHub (e.g. `eventsphere`).
2. Initialize local git:
```
cd eventsphere
git init
git add .
git commit -m "Initial commit - EventSphere starter"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

---

## Deployment suggestions (simple)
### Backend (Render / Railway / Heroku)
- Create a new service, connect to your GitHub repo and point to `backend/`.
- Set env variables in the service dashboard (MONGO_URI, JWT_SECRET, CLOUDINARY_*, SMTP_*).
- Start service; note backend URL (e.g. `https://eventsphere-api.onrender.com`).

### Frontend (Vercel / Netlify)
- Connect your GitHub repo, use root `frontend/` (or set build command `npm run build` and publish `dist`).
- Set environment variable `VITE_API_URL` to your deployed backend API URL + `/api`.
- Deploy.

---
