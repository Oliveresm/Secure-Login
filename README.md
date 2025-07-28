# 🔐 Secure Auth System – Modular Login with Local and OAuth

A complete, secure **authentication system** built with modern technologies. This module is designed to be reusable in multiple projects requiring secure login, registration, and password recovery—whether for chat systems, dashboards, or SaaS platforms.

---

## Features

- **Authentication**
  - Local (email + password)
  - OAuth via Google (Firebase)
  - Email verification with expiring tokens (5 min)
  - Password recovery with secure reset flow

- **Security Best Practices**
  - JWT for access tokens
  - Refresh tokens in **HTTP-only cookies**
  - Bcrypt password hashing
  - Automatic cleanup of expired/unused tokens

- **Modular Architecture**
  - TypeScript, Express backend
  - Frontend in React + Vite + Tailwind
  - MySQL with stored procedures and scheduled events
  - Clean code separation (routes, services, repositories)

- **Testing**
  - Unit and integration tests with **Vitest** and **Supertest**

---

This builds and runs:

- A MySQL database  
- The backend API on [http://localhost:3001](http://localhost:3001)  
- The frontend on [http://localhost:5174](http://localhost:5174)  

No additional setup is required. Database is initialized automatically.

---

## 📁 Project Structure

```bash
.
├── backend/              # Express + TypeScript + SQL
│   ├── src/              # Controllers, routes, services, etc.
│   └── db/               # Init scripts, procedures, events
├── frontend/             # React + Tailwind + Auth views
├── docker-compose.yml
└── README.md

## Auth Flow Summary

- **Register (local):** Email/password → verification email → activate account  
- **Login (local):** Valid credentials → access + refresh tokens  
- **OAuth login:** Google sign-in via Firebase → auto-registration if new  
- **Forgot password:** Email with reset link/token  
- **Token renewal:** Automatic when access token expires

---

## Running Tests

```bash

Frontend

cd backend
npm install
npm run test

Backend

cd frontend
npm install
npm run test

```markdown

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript, MySQL, bcrypt, JWT  
- **Frontend:** React, Vite, Tailwind, Firebase Auth, Axios  
- **Testing:** Vitest, Supertest (backend & frontend)  
- **DevOps:** Docker, Docker Compose

## 📦 Deployment

You can run the entire authentication system using Docker:

```bash
docker-compose up --build
```

This will start:

-  **MySQL** database initialized via SQL scripts
-  **Backend** (Node.js + Express) on [http://localhost:3001](http://localhost:3001)
-  **Frontend** (React + Vite) on [http://localhost:5174](http://localhost:5174)

No additional setup is required **as long as** the following configuration files are present.

---

## Requirements Before Deployment

To run this system successfully, you must provide the following configuration files:

### 1. `backend/.env`

```dotenv
DB_HOST=mysql_db
DB_USER=usuario
DB_PASS=supersecreta
DB_NAME=chat_service_db
PORT=3000
FRONTEND_URL=http://localhost:5174

NODE_ENV=development

# SMTP configuration (use **your** credentials, do **not** commit real values)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# JWT secrets (set strong, unique values)
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

 **SMTP values are required for sending verification and recovery emails.**

---

### 2. `frontend/.env`

```dotenv
VITE_API_URL=http://localhost:3001/api

VITE_FIREBASE_API_KEY=AIzaSyB...           # from Firebase
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

 **These Firebase values must match your Firebase project.**

---

### 3. `backend/firebase-service-account.json`

You must include a valid Firebase **Service Account JSON** file used to verify Firebase ID tokens on the backend.\
Place it at:

```bash
backend/firebase-service-account.json
```

📌 *Generate this file in Firebase Console → ****Project Settings**** → ****Service accounts**** → ****Generate new private key***

---

## 🛠️ Deployment Summary

| Service    | Description                        |
| ---------- | ---------------------------------- |
| `mysql_db` | MySQL database with auto-init      |
| `init_db`  | Runs scripts to create tables      |
| `backend`  | TypeScript API with auth endpoints |
| `frontend` | React + Vite interface             |

All services run in a single Docker network (`app_net`), and the database is automatically initialized via `/BackEnd/db/init_db.sh`.

---

## 🌐 Access After Deployment

| Service  | URL                                            |
| -------- | ---------------------------------------------- |
| Backend  | [http://localhost:3001](http://localhost:3001) |
| Frontend | [http://localhost:5174](http://localhost:5174) |

---

## 🙋‍♂️ Contact

Oliver Suárez  
[LinkedIn](www.linkedin.com/in/oliversuamora) • [GitHub](https://github.com/Oliveresm) • [oliveresm@outlook.com]





