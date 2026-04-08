# Space Frontiers Pakistan — Backend

This is a small Node.js (Express) backend that:
- serves the existing static website files from the repo root
- provides JSON APIs for register/login/logout
- stores users in a local JSON file at `backend/data/db.json`

## Prerequisites
- Node.js 18+ installed

## Setup (Windows PowerShell)

From the repo root:

```powershell
cd backend
npm install
npm start
```

Then open:
- `http://127.0.0.1:5000/`

## Optional: set a session secret

```powershell
$env:SESSION_SECRET = "change-this-to-a-long-random-string"
npm start
```

## API endpoints

- `POST /api/register` body:
  - `{ "email": "...", "password": "...", "firstName": "...", "lastName": "..." }`
- `POST /api/login` body:
  - `{ "email": "...", "password": "..." }`
- `POST /api/logout`
- `GET /api/me`

