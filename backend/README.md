# Space Frontiers Pakistan — Backend

This is a small Flask backend that:
- serves the existing static website files from the repo root
- provides JSON APIs for register/login/logout
- stores users in a local JSON file at `backend/data/db.json`

## Prerequisites
- Python 3.10+ installed

## Setup (Windows PowerShell)

From the repo root:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Then open:
- `http://127.0.0.1:5000/`

## Optional: set a secret key

For better session security, set `FLASK_SECRET_KEY`:

```powershell
$env:FLASK_SECRET_KEY = "change-this-to-a-long-random-string"
python app.py
```

## API endpoints

- `POST /api/register` body:
  - `{ "email": "...", "password": "...", "firstName": "...", "lastName": "..." }`
- `POST /api/login` body:
  - `{ "email": "...", "password": "..." }`
- `POST /api/logout`
- `GET /api/me`

